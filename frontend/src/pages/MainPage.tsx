import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  fetchContacts,
  fetchCategories,
  createState,
  searchUsers,
  Category,
  ContactKanjoDto,
  UserSummary,
} from '../api/client';
import { generateFakeContacts } from '../utils/fakeContacts';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

interface ContactThread {
  key: string;
  user: UserSummary;
  entries: ContactKanjoDto[];
}

// A kanjo sent without picking a recipient ("skip association") has no user
// to build a conversation around, so it's excluded from the contacts list
// entirely rather than shown as a dead-end "unknown" thread.
function groupByContact(contacts: ContactKanjoDto[]): ContactThread[] {
  const threadsByKey = new Map<string, ContactThread>();

  contacts.forEach((contact) => {
    if (!contact.user) return;
    const key = contact.user.id;
    const thread = threadsByKey.get(key);
    if (thread) {
      thread.entries.push(contact);
    } else {
      threadsByKey.set(key, { key, user: contact.user, entries: [contact] });
    }
  });

  const threads = Array.from(threadsByKey.values());
  threads.forEach((thread) =>
    thread.entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  );
  threads.sort(
    (a, b) => new Date(b.entries[0].createdAt).getTime() - new Date(a.entries[0].createdAt).getTime(),
  );
  return threads;
}

export default function MainPage() {
  const { t } = useTranslation();
  const { categoryName, stateCategoryName } = useCategoryTranslation();
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState<ContactKanjoDto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [sendingNew, setSendingNew] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [addingContact, setAddingContact] = useState(false);
  const [contactQuery, setContactQuery] = useState('');
  const [contactResults, setContactResults] = useState<UserSummary[]>([]);
  const [searchingContact, setSearchingContact] = useState(false);
  // A contact just added via "+" but with no kanjo sent yet — it has no
  // entry in `contacts` (there's nothing in the DB to derive it from), so
  // it can't come out of groupByContact like every other thread.
  const [pendingContact, setPendingContact] = useState<UserSummary | null>(null);

  useEffect(() => {
    fetchContacts()
      .then(setContacts)
      .finally(() => setLoading(false));
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setComposing(false);
    setSendError(false);
  }, [selectedKey]);

  useEffect(() => {
    if (!contactQuery.trim()) {
      setContactResults([]);
      return;
    }
    setSearchingContact(true);
    const timeout = setTimeout(() => {
      searchUsers(contactQuery)
        .then(setContactResults)
        .finally(() => setSearchingContact(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [contactQuery]);

  const threads = useMemo(() => groupByContact(contacts), [contacts]);
  const selectedThread =
    threads.find((thread) => thread.key === selectedKey) ??
    (pendingContact && pendingContact.id === selectedKey
      ? { key: pendingContact.id, user: pendingContact, entries: [] }
      : null);

  function startAddingContact() {
    setAddingContact(true);
  }

  function cancelAddingContact() {
    setAddingContact(false);
    setContactQuery('');
    setContactResults([]);
  }

  function pickNewContact(newContact: UserSummary) {
    setPendingContact(newContact);
    setSelectedKey(newContact.id);
    cancelAddingContact();
  }

  function toggleDemoMode() {
    setSelectedKey(null);
    if (demoMode) {
      setLoading(true);
      fetchContacts()
        .then(setContacts)
        .finally(() => setLoading(false));
      setDemoMode(false);
    } else {
      setContacts(generateFakeContacts());
      setDemoMode(true);
    }
  }

  async function sendKanjoToThread(category: Category) {
    if (!selectedThread?.user) return;
    setSendingNew(true);
    setSendError(false);
    try {
      const state = await createState(category.id, selectedThread.user.id);
      setContacts((prev) => [
        {
          id: state.id,
          user: state.aboutUser,
          categoryId: state.categoryId,
          categoryName: state.categoryName,
          direction: 'sent' as const,
          checked: false,
          createdAt: state.createdAt,
          url: state.url,
        },
        ...prev.filter((c) => c.id !== state.id),
      ]);
      setPendingContact(null);
      setComposing(false);
    } catch {
      setSendError(true);
    } finally {
      setSendingNew(false);
    }
  }

  function formatDate(iso: string) {
    const date = new Date(iso);
    const datePart = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    const timePart = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${datePart} · ${timePart}`;
  }

  return (
    <div className="page">
      <header className="topbar">
        <BrandMark size="sm" inline />
        <div className="topbar-actions">
          {import.meta.env.DEV && (
            <button className="link-button" onClick={toggleDemoMode}>
              {demoMode ? t('main.previewRealData') : t('main.previewFakeData')}
            </button>
          )}
          <button className="link-button" onClick={() => logout()}>
            {t('main.logout')}
          </button>
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
        </div>
      </header>

      <main className={`main-layout ${selectedThread ? 'has-selection' : ''}`}>
        <section className="contacts-sidebar">
          <div className="sidebar-header">
            <span className="section-label">{t('main.contacts')}</span>
            <button
              type="button"
              className="button icon-button"
              aria-label={t('main.addContact')}
              title={t('main.addContact')}
              onClick={startAddingContact}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>

          {addingContact ? (
            <div className="user-search fade-in">
              <div className="compose-header">
                <span className="section-label">{t('generate.associateWith')}</span>
                <button type="button" className="link-button" onClick={cancelAddingContact}>
                  {t('common.cancel')}
                </button>
              </div>
              <input
                type="text"
                autoFocus
                placeholder={t('generate.searchUserPlaceholder')}
                value={contactQuery}
                onChange={(e) => setContactQuery(e.target.value)}
              />
              {searchingContact && <p className="hint">{t('generate.searching')}</p>}
              {!searchingContact && contactQuery.trim() && contactResults.length === 0 && (
                <p className="hint">{t('generate.noUserFound')}</p>
              )}
              {!searchingContact && contactResults.length > 0 && (
                <ul className="user-results">
                  {contactResults.map((u) => (
                    <li key={u.id}>
                      <button className="user-result-item" onClick={() => pickNewContact(u)}>
                        @{u.username}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <>
              {loading && <p className="hint">{t('common.loading')}</p>}
              {!loading && threads.length === 0 && <p className="hint">{t('main.noContactsYet')}</p>}
              <ul className="state-list">
                {threads.map((thread) => {
                  const latest = thread.entries[0];
                  return (
                    <li key={thread.key}>
                      <button
                        type="button"
                        className={`thread-item ${selectedKey === thread.key ? 'thread-item-active' : ''}`}
                        onClick={() => {
                          setSelectedKey(thread.key);
                          setPendingContact(null);
                        }}
                      >
                        <div className="contact-avatar">{thread.user.username[0]?.toUpperCase()}</div>
                        <div className="thread-item-body">
                          <div className="thread-item-top">
                            <span className="contact-username">@{thread.user.username}</span>
                            {thread.entries.length > 1 && <span className="thread-count">{thread.entries.length}</span>}
                          </div>
                          <p className="thread-item-preview">{stateCategoryName(latest.categoryId, latest.categoryName)}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>

        <section className="history-panel">
          {!selectedThread && <p className="hint history-placeholder">{t('main.selectContact')}</p>}

          {selectedThread && (
            <>
              <div className="history-header">
                <button type="button" className="link-button history-back" onClick={() => setSelectedKey(null)}>
                  ← {t('common.back')}
                </button>
                <div className="contact-identity">
                  <div className="contact-avatar">{selectedThread.user.username[0]?.toUpperCase()}</div>
                  <span className="contact-username">@{selectedThread.user.username}</span>
                </div>
              </div>

              {selectedThread.entries.length === 0 && !composing && (
                <p className="hint history-placeholder">{t('main.newContactHint')}</p>
              )}

              <ul className="state-list history-entries">
                {selectedThread.entries.map((contact) => (
                  <li key={contact.id} className={`contact-card contact-card-${contact.direction}`}>
                    <div className="contact-top">
                      <span
                        className={`contact-badge contact-badge-${
                          contact.direction === 'sent' && contact.checked ? 'read' : contact.direction
                        }`}
                      >
                        {contact.direction === 'sent'
                          ? t(contact.checked ? 'main.read' : 'main.sent')
                          : t('main.received')}
                      </span>
                      <span className="hint">{formatDate(contact.createdAt)}</span>
                    </div>

                    <p className="contact-kanjo">{stateCategoryName(contact.categoryId, contact.categoryName)}</p>
                  </li>
                ))}
              </ul>

              {composing ? (
                <div className="category-grid category-grid-compact category-grid-conversation fade-in">
                  <div className="compose-header">
                    <span className="section-label">{t('generate.category')}</span>
                    <button type="button" className="link-button" disabled={sendingNew} onClick={() => setComposing(false)}>
                      {t('common.cancel')}
                    </button>
                  </div>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      className="button category-button category-button-compact"
                      disabled={sendingNew}
                      onClick={() => sendKanjoToThread(c)}
                    >
                      <span className="category-button-name">{categoryName(c)}</span>
                    </button>
                  ))}
                  {sendError && <p className="error">{t('generate.generationFailed')}</p>}
                </div>
              ) : (
                <button type="button" className="button primary conversation-send-button" onClick={() => setComposing(true)}>
                  {t('main.generate')}
                </button>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
