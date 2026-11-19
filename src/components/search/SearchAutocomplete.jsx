import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'
import { getSearchSuggestions } from '../../lib/search.js'
import { formatPKR } from '../../lib/businessRules.js'
import { ProductImage } from '../ui/ProductImage.jsx'

export function SearchAutocomplete({
  products,
  value,
  onChange,
  onSubmit,
  onProductSelect,
  placeholder = 'Search products, brands, categories…',
  idPrefix = 'search',
  size = 'lg',
  showSeeAll = true,
}) {
  const generatedId = useId()
  const listboxId = `${idPrefix}-suggestions-${generatedId.replace(/:/g, '')}`
  const inputId = `${idPrefix}-input-${generatedId.replace(/:/g, '')}`
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  // The parent may update the URL inside a React transition. Keeping a local
  // draft means fast typing is never reverted to a stale URL value.
  const [draftValue, setDraftValue] = useState(value)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    if (!isFocused || value === '') setDraftValue(value)
  }, [value, isFocused])

  const suggestions = useMemo(() => getSearchSuggestions(products, draftValue), [products, draftValue])
  const showSuggestions = isOpen && draftValue.trim().length >= 2

  useEffect(() => {
    setActiveIndex(-1)
  }, [draftValue])

  function updateDraft(nextValue) {
    setDraftValue(nextValue)
    onChange(nextValue)
  }

  useEffect(() => {
    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function chooseProduct(product) {
    setIsOpen(false)
    setActiveIndex(-1)
    onProductSelect(product)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsOpen(false)
    setActiveIndex(-1)
    onSubmit?.(draftValue)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setActiveIndex(0)
        return
      }
      if (suggestions.length > 0) {
        setActiveIndex((index) => (index + 1) % suggestions.length)
      }
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (suggestions.length > 0) {
        setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
      }
      return
    }

    if (event.key === 'Enter' && isOpen && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault()
      chooseProduct(suggestions[activeIndex])
    }
  }

  const isCompact = size === 'sm'

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form role="search" onSubmit={handleSubmit} className="relative">
        <label htmlFor={inputId} className="sr-only">
          Search products by name, brand, or category
        </label>
        <Search
          aria-hidden="true"
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/45 ${
            isCompact ? 'h-4 w-4' : 'h-5 w-5'
          }`}
        />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls={listboxId}
          aria-activedescendant={
            showSuggestions && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          value={draftValue}
          onChange={(event) => {
            updateDraft(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            setIsFocused(true)
            setIsOpen(true)
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full rounded-2xl border border-brand-charcoal/15 bg-white pl-11 pr-11 font-medium text-brand-charcoal shadow-sm outline-none transition placeholder:text-brand-charcoal/45 focus:border-brand-blue-strong focus:ring-4 focus:ring-brand-blue/30 [&::-webkit-search-cancel-button]:hidden ${
            isCompact ? 'h-11 text-sm' : 'h-14 text-base'
          }`}
        />
        {draftValue && (
          <button
            type="button"
            onClick={() => {
              updateDraft('')
              setActiveIndex(-1)
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-brand-charcoal/50 transition hover:bg-brand-blue-soft hover:text-brand-charcoal"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
        {!draftValue && (
          <button
            type="submit"
            aria-label="Search"
            className={`absolute right-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-xl bg-brand-blue text-brand-charcoal transition hover:bg-brand-blue/80 ${
              isCompact ? 'h-8 w-8' : 'h-10 w-10'
            }`}
          >
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </form>

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-white shadow-lift">
          {suggestions.length > 0 ? (
            <ul role="listbox" id={listboxId} aria-label="Product suggestions" className="max-h-[26rem] overflow-y-auto py-2">
              {suggestions.map((product, index) => (
                <li
                  key={product.id}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  className={activeIndex === index ? 'bg-brand-blue-soft' : ''}
                >
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => chooseProduct(product)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-brand-blue-soft focus-visible:bg-brand-blue-soft focus-visible:outline-none"
                  >
                    <ProductImage
                      src={product.image}
                      alt=""
                      className="h-11 w-11 shrink-0 overflow-hidden rounded-xl object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-brand-charcoal">{product.name}</span>
                      <span className="block truncate text-xs text-brand-charcoal/60">
                        {product.brand} · {product.category}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-bold text-brand-navy">{formatPKR(product.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 text-sm text-brand-charcoal/65">
              No quick matches. Press Enter to search the full catalogue or try a brand or category.
            </div>
          )}

          {showSeeAll && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                onSubmit?.(draftValue)
              }}
              className="flex w-full items-center justify-between gap-3 border-t border-brand-charcoal/10 bg-brand-cream/70 px-4 py-3 text-left text-xs font-bold text-brand-navy transition hover:bg-brand-blue-soft"
            >
              <span>See all results for “{draftValue.trim()}”</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
