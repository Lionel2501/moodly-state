import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { fetchContacts, fetchCategories, createState, deleteState, Category, ContactKanjoDto } from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function MainPage() {
  const { t } = useTranslation();
  const { categoryName, stateCategoryName } = useCategoryTranslation();
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState<ContactKanjoDto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="page">
      <header className="topbar">
        <BrandMark size="sm" inline />
        <div className="topbar-actions">
          <button className="link-button" onClick={() => logout()}>
            {t('main.logout')}
          </button>
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
        </div>
      </header>

      <main className="content">
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="section-label">{t('main.contacts')}</span>
          {loading && <p className="hint">{t('common.loading')}</p>}
          {!loading && contacts.length === 0 && <p className="hint">{t('main.noContactsYet')}</p>}
          <ul className="state-list">
            {contacts.map((contact) => (
              <li key={contact.id} className="contact-card">
                <button
                  type="button"
                  className="contact-toggle"
                  onClick={() => toggleExpanded(contact)}
                  aria-expanded={expandedId === contact.id}
                >
                  <div className="contact-top">
                    <div className="contact-identity">
                      <div className="contact-avatar">{contact.user ? contact.user.username[0]?.toUpperCase() : '?'}</div>
                      <span className={contact.user ? 'contact-username' : 'contact-username contact-username-unknown'}>
                        {contact.user ? `@${contact.user.username}` : t('main.unknownUser')}
                      </span>
                    </div>
                    <span
                      className={`contact-badge contact-badge-${
                        contact.direction === 'sent' && contact.checked ? 'read' : contact.direction
                      }`}
                    >
                      {contact.direction === 'sent'
                        ? t(contact.checked ? 'main.read' : 'main.sent')
                        : t('main.received')}
                    </span>
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
        </section>

        <Link to="/generate" className="button primary generate-button">
          {t('main.generate')}
        </Link>
      </main>
    </div>
  );
}
