import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type * as React from 'react'
import { EditIcon, PencilIcon } from '../icons'
import type { Book, Page } from '../models'
import { COLOR_PRESETS, DEFAULT_FONT_FAMILY, hexToRgb, rgbToHex } from '../utils/color'

export function NotebookPage({
  userEmail,
  books,
  selectedBookId,
  setSelectedBookId,
  selectedPageId,
  setSelectedPageId,
  createNewBook,
  createNewPage,
  updateBook,
  updatePage,
  deletePage: _deletePage,
  textColor,
  setTextColor,
  fontSize,
  setFontSize,
  editorFontFamily,
  setEditorFontFamily,
}: {
  userEmail: string | null
  books: Book[]
  selectedBookId: string | null
  setSelectedBookId: (id: string | null) => void
  selectedPageId: string | null
  setSelectedPageId: (id: string | null) => void
  createNewBook: () => void
  createNewPage: (bookId: string) => void
  updateBook: (bookId: string, updates: Partial<Omit<Book, 'id' | 'pages'>> & { pages?: Page[] }) => void
  updatePage: (bookId: string, pageId: string, updates: Partial<Omit<Page, 'id'>>) => void
  deletePage: (bookId: string, pageId: string) => void
  textColor: string
  setTextColor: (color: string) => void
  fontSize: string
  setFontSize: (size: string) => void
  editorFontFamily: string
  setEditorFontFamily: (family: string) => void
}) {
  const [mixerOpen, setMixerOpen] = useState(false)
  const [mixerR, setMixerR] = useState(205)
  const [mixerG, setMixerG] = useState(214)
  const [mixerB, setMixerB] = useState(244)

  useEffect(() => {
    const rgb = hexToRgb(textColor)
    if (rgb) {
      setMixerR(rgb.r)
      setMixerG(rgb.g)
      setMixerB(rgb.b)
    }
  }, [textColor])

  const selectedBook = books.find((b) => b.id === selectedBookId) || null
  const selectedPage = selectedBook?.pages.find((p) => p.id === selectedPageId) || null
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const renderFormattedPreview = (text: string) => {
    // replace [font=name]...[/font] with styled spans
    const html = text.replace(/\[font=(.+?)\]([\s\S]*?)\[\/font\]/g, (_m, fname, inner) => {
      return `<span style="font-family:${fname};">${escapeHtml(inner)}</span>`
    })
    return html.replace(/\n/g, '<br/>')
  }

  const applyFontToSelection = (font: string) => {
    if (!selectedBook || !selectedPage) return
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    if (start == null || end == null || start === end) {
      // no selection -> treat as global change
      setEditorFontFamily(font)
      setTimeout(() => setEditorFontFamily(font), 0)
      return
    }
    const current = selectedPage.content || ''
    const before = current.slice(0, start)
    const selected = current.slice(start, end)
    const after = current.slice(end)
    const wrapped = `${before}[font=${font}]${selected}[/font]${after}`
    updatePage(selectedBook.id, selectedPage.id, { content: wrapped })
  }

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Drafty</h1>
          <p>Your thoughts, organized</p>
          <button className="new-note-btn primary" onClick={createNewBook}>
            <EditIcon size={16} /> New Book
          </button>
        </div>
        <div className="notes-list">
          {books.map((book) => (
            <div
              key={book.id}
              className={`note-item ${selectedBookId === book.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedBookId(book.id)
                setSelectedPageId(book.pages.length > 0 ? book.pages[0].id : null)
              }}
            >
              <div className="note-item-title">{book.name || 'Untitled Book'}</div>
              <div className="note-item-preview">{book.pages.length} page{book.pages.length === 1 ? '' : 's'}</div>
              <div className="note-item-date">{formatDate(book.updatedAt)}</div>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{userEmail}</span>
          </div>
        </div>
      </aside>

      <aside className="sidebar pages-sidebar">
        <div className="sidebar-header">
          <h1>Pages</h1>
          <p>{selectedBook ? selectedBook.name : 'Select a book'}</p>
          <button
            className="new-note-btn"
            onClick={() => {
              if (selectedBook) createNewPage(selectedBook.id)
            }}
            disabled={!selectedBook}
          >
            <EditIcon size={16} /> New Page
          </button>
        </div>

        <div className="notes-list">
          {selectedBook?.pages
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((page, idx) => (
              <div
                key={page.id}
                className={`note-item ${selectedPageId === page.id ? 'active' : ''}`}
                onClick={() => setSelectedPageId(page.id)}
              >
                <div className="note-item-header">
                  <span className="page-number">{idx + 1}</span>
                  <div className="note-item-title">{page.name || 'Untitled Page'}</div>
                  <div className="page-reorder-buttons">
                    <button
                      type="button"
                      className="reorder-btn"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        if (!selectedBook) return
                        const sortedPages = selectedBook.pages.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        const currentIdx = sortedPages.findIndex((p) => p.id === page.id)
                        if (currentIdx > 0) {
                          const prevPage = sortedPages[currentIdx - 1]
                          const tempOrder = page.order ?? 0
                          updatePage(selectedBook.id, page.id, { order: prevPage.order ?? 0 })
                          updatePage(selectedBook.id, prevPage.id, { order: tempOrder })
                        }
                      }}
                      disabled={idx === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="reorder-btn"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        if (!selectedBook) return
                        const sortedPages = selectedBook.pages.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        const currentIdx = sortedPages.findIndex((p) => p.id === page.id)
                        if (currentIdx < sortedPages.length - 1) {
                          const nextPage = sortedPages[currentIdx + 1]
                          const tempOrder = page.order ?? 0
                          updatePage(selectedBook.id, page.id, { order: nextPage.order ?? 0 })
                          updatePage(selectedBook.id, nextPage.id, { order: tempOrder })
                        }
                      }}
                      disabled={idx === (selectedBook?.pages.length ?? 0) - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                <div className="note-item-preview">{page.content.substring(0, 60) || 'No content'}</div>
                <div className="note-item-date">{formatDate(page.updatedAt)}</div>
              </div>
            ))}
        </div>
      </aside>

      <main className="editor-container">
        {selectedBook && selectedPage ? (
          <>
            <div className="editor-header">
              <div>{formatDate(selectedPage.updatedAt)}</div>
              <div className="editor-actions">
                <div className="text-formatting-toolbar">
                  <label className="formatting-label">
                    Color
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTextColor(e.target.value)}
                      className="color-picker"
                    />
                  </label>

                  <div className="color-presets" aria-label="Color presets">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c}
                        className="color-swatch"
                        style={{ backgroundColor: c }}
                        onClick={() => setTextColor(c)}
                        aria-label={`Set color ${c}`}
                        type="button"
                      />
                    ))}
                    <button type="button" className="mixer-toggle" onClick={() => setMixerOpen(!mixerOpen)}>
                      {mixerOpen ? 'Hide Mixer' : 'Mixer'}
                    </button>
                  </div>

                  <label className="formatting-label">
                    Font Size
                    <select
                      value={fontSize}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFontSize(e.target.value)}
                      className="font-size-select"
                    >
                      <option value="12">12px</option>
                      <option value="14">14px</option>
                      <option value="16">16px</option>
                      <option value="18">18px</option>
                      <option value="20">20px</option>
                      <option value="24">24px</option>
                    </select>
                  </label>

                  <label className="formatting-label">
                    Font
                    <select
                      value={editorFontFamily}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        const val = e.target.value
                        // if user has text selected, apply font to selection
                        applyFontToSelection(val)
                      }}
                      className="font-size-select"
                    >
                      <option value={DEFAULT_FONT_FAMILY}>System</option>
                      <option value={'Georgia, "Times New Roman", serif'}>Serif</option>
                      <option
                        value={'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}
                      >
                        Mono
                      </option>
                      <option value={'"Trebuchet MS", "Segoe UI", sans-serif'}>Rounded</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {mixerOpen && (
              <div className="mixer-panel">
                <div className="mixer-preview" style={{ backgroundColor: rgbToHex(mixerR, mixerG, mixerB) }} />
                <div className="mixer-controls">
                  <label>
                    R {mixerR}
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={mixerR}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMixerR(parseInt(e.target.value, 10))}
                    />
                  </label>
                  <label>
                    G {mixerG}
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={mixerG}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMixerG(parseInt(e.target.value, 10))}
                    />
                  </label>
                  <label>
                    B {mixerB}
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={mixerB}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMixerB(parseInt(e.target.value, 10))}
                    />
                  </label>
                </div>
                <div className="mixer-actions">
                  <div className="mixer-hex">{rgbToHex(mixerR, mixerG, mixerB)}</div>
                  <button type="button" onClick={() => setTextColor(rgbToHex(mixerR, mixerG, mixerB))}>
                    Apply
                  </button>
                </div>
              </div>
            )}

            <div className="editor-content">
              <input
                type="text"
                className="note-title-input"
                value={selectedBook.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateBook(selectedBook.id, { name: e.target.value })}
                placeholder="Book name..."
              />
              <div className="page-header">
                <span className="page-number-display">
                  Page {(selectedBook.pages.findIndex((p) => p.id === selectedPage.id) ?? -1) + 1} of {selectedBook.pages.length}
                </span>
                <input
                  type="text"
                  className="page-title-input"
                  value={selectedPage.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updatePage(selectedBook.id, selectedPage.id, { name: e.target.value })}
                  placeholder="Page name..."
                />
              </div>
              <textarea
                className="note-content-textarea"
                value={selectedPage.content}
                ref={textareaRef}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  updatePage(selectedBook.id, selectedPage.id, { content: e.target.value })
                }
                placeholder="Start writing on this page..."
                style={{ color: textColor, fontSize: `${fontSize}px`, fontFamily: editorFontFamily }}
              />
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Preview (formatted)</div>
                <div
                  className="note-preview-formatted"
                  style={{ padding: 12, border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--bg-secondary)' }}
                  dangerouslySetInnerHTML={{ __html: renderFormattedPreview(selectedPage.content) }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <PencilIcon size={64} />
            </div>
            <h2>No Page Selected</h2>
            <p>Create a book/page or select one from the sidebar</p>
          </div>
        )}
      </main>
    </>
  )
}
