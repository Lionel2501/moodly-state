import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { fetchContacts, fetchCategories, createState, deleteState, Category, ContactKanjoDto, UserSummary } from '../api/client';
import { generateFakeContacts } from '../utils/fakeContacts';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

interface ContactThread {
  key: string;
  user: UserSummary | null;
  entries: ContactKanjoDto[];
}

function groupByContact(contacts: ContactKanjoDto[]): ContactThread[] {
  const threadsByKey = new Map<string, ContactThread>();

  contacts.forEach((contact) => {
    const key = contact.user ? contact.user.id : `unknown-${contact.id}`;
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts()
      .then(setContacts)
      .finally(() => setLoading(false));
    fetchCategories().then(setCategories);
  }, []);

  const threads = useMemo(() => groupByContact(contacts), [contacts]);
  const selectedThread = threads.find((thread) => thread.key === selectedKey) ?? null;

  function toggleDemoMode() {
    setSelectedKey(null);
    setExpandedId(null);
    setEditingId(null);
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

  async function copyUrl(contact: ContactKanjoDto) {
    try {
      await navigator.clipboard.writeText(contact.url);
      setCopiedId(contact.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard API unavailable, ignore silently
    }
  }

  async function changeCategory(contact: ContactKanjoDto, category: Category) {
    if (!contact.user) return;
    setUpdatingId(contact.id);
    try {
      const updated = await createState(category.id, contact.user.id);
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contact.id
            ? {
                ...c,
                id: updated.id,
                categoryId: updated.categoryId,
                categoryName: updated.categoryName,
                createdAt: updated.createdAt,
                url: updated.url,
              }
            : c,
        ),
      );
      setEditingId(null);
    } finally {
      setUpdatingId(null);
    }
  }

  async function removeContact(contact: ContactKanjoDto) {
    if (!window.confirm(t('main.confirmDelete'))) return;
    setDeletingId(contact.id);
    try {
      await deleteState(contact.id);
      setContacts((prev) => prev.filter((c) => c.id !== contact.id));
    } finally {
      setDeletingId(null);
    }
  }

  function toggleExpanded(contact: ContactKanjoDto) {
    setExpandedId((prev) => (prev === contact.id ? null : contact.id));
    setEditingId(null);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
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
          <span className="section-label">{t('main.contacts')}</span>
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
                    onClick={() => setSelectedKey(thread.key)}
                  >
                    <div className="contact-avatar">{thread.user ? thread.user.username[0]?.toUpperCase() : '?'}</div>
                    <div className="thread-item-body">
                      <div className="thread-item-top">
                        <span className={thread.user ? 'contact-username' : 'contact-username contact-username-unknown'}>
                          {thread.user ? `@${thread.user.username}` : t('main.unknownUser')}
                        </span>
                        {thread.entries.length > 1 && <span className="thread-count">{thread.entries.length}</span>}
                      </div>
                      <p className="thread-item-preview">{stateCategoryName(latest.categoryId, latest.categoryName)}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <Link to="/generate" className="button primary generate-button">
            {t('main.generate')}
          </Link>
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
                  <div className="contact-avatar">
                    {selectedThread.user ? selectedThread.user.username[0]?.toUpperCase() : '?'}
                  </div>
                  <span className={selectedThread.user ? 'contact-username' : 'contact-username contact-username-unknown'}>
                    {selectedThread.user ? `@${selectedThread.user.username}` : t('main.unknownUser')}
                  </span>
                </div>
              </div>

              <ul className="state-list history-entries">
                {selectedThread.entries.map((contact) => (
                  <li key={contact.id} className="contact-card">
                    <button
                      type="button"
                      className="contact-toggle"
                      onClick={() => toggleExpanded(contact)}
                      aria-expanded={expandedId === contact.id}
                    >
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

                      <div className="contact-kanjo-row">
                        <p className="contact-kanjo">{stateCategoryName(contact.categoryId, contact.categoryName)}</p>
                        <svg
                          className={`chevron contact-chevron ${expandedId === contact.id ? 'contact-chevron-open' : ''}`}
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </button>

                    {expandedId === contact.id && editingId !== contact.id && (
                      <div className="contact-actions fade-in">
                        {contact.direction === 'sent' && contact.user && (
                          <button className="button outline small" onClick={() => setEditingId(contact.id)}>
                            {t('main.change')}
                          </button>
                        )}
                        <button className="button small" onClick={() => copyUrl(contact)}>
                          {copiedId === contact.id ? t('common.copied') : t('common.copy')}
                        </button>
                        {contact.direction === 'sent' && (
                          <button
                            className="button small icon-button icon-button-danger"
                            disabled={deletingId === contact.id}
                            onClick={() => removeContact(contact)}
                            aria-label={t('main.delete')}
                            title={t('main.delete')}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}

                    {editingId === contact.id && (
                      <div className="category-grid category-grid-compact fade-in">
                        {categories.map((c) => (
                          <button
                            key={c.id}
                            className="button category-button category-button-compact"
                            disabled={updatingId === contact.id}
                            onClick={() => changeCategory(contact, c)}
                          >
                            <span className="category-button-name">{categoryName(c)}</span>
                          </button>
                        ))}
                        <button className="link-button" disabled={updatingId === contact.id} onClick={() => setEditingId(null)}>
                          {t('common.cancel')}
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
