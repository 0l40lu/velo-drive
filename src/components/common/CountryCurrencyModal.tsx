import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SUPPORTED_COUNTRIES,
  CountryCurrencyConfig
} from '../../utils/currency';
import {
  ArrowLeft,
  Search,
  Globe2,
  Check,
  TrendingUp,
  Coins
} from 'lucide-react';

export const CountryCurrencyModal: React.FC = () => {
  const {
    currentCountry,
    setCountry,
    currency,
    closeModal,
    triggerHaptic
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = SUPPORTED_COUNTRIES.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.country.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
    );
  });

  const handleSelectCountry = (config: CountryCurrencyConfig) => {
    triggerHaptic('medium');
    setCountry(config.country);
    closeModal();
  };

  return (
    <div className="absolute inset-0 bg-[#0A0A0A] z-50 flex flex-col animate-in slide-in-from-bottom duration-300 select-none">
      {/* Top Header */}
      <div className="w-full bg-[#171717]/95 backdrop-blur-md border-b border-[#262626] px-4 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            triggerHaptic('light');
            closeModal();
          }}
          className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1.5">
          <Globe2 className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Select Country & Currency
          </h2>
        </div>

        <div className="w-7 h-7" />
      </div>

      {/* Active Selection Hero Banner Bento Box */}
      <div className="p-4 bg-[#171717] border-b border-[#262626] shrink-0">
        <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-2xl p-3.5 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-3">
            <span className="text-3xl filter drop-shadow">{currency.flag}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-white">{currency.country}</h3>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {currency.name} • <span className="text-emerald-400 font-bold">{currency.code} ({currency.symbol})</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Rate vs USD</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">
              1 USD = {currency.exchangeRate} {currency.code}
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mt-3">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="country-currency-search"
            type="text"
            placeholder="Search country or currency (e.g. UK, Euro, JPY, NGN)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-emerald-500 text-white rounded-xl pl-9 pr-3.5 py-2 text-xs placeholder-zinc-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Country List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
          Available Global Regions ({filteredCountries.length})
        </span>

        {filteredCountries.map(c => {
          const isSelected = c.country.toLowerCase() === currentCountry.toLowerCase();
          return (
            <div
              key={c.country}
              id={`country-item-${c.code.toLowerCase()}`}
              onClick={() => handleSelectCountry(c)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                  : 'bg-[#171717] border-[#262626] hover:bg-zinc-800/60 text-zinc-300'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span className="text-2xl">{c.flag}</span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white truncate">{c.country}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700">
                      {c.code} ({c.symbol})
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {c.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    {c.exchangeRate === 1.0 ? 'Base currency' : `1 USD = ${c.exchangeRate}`}
                  </span>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-zinc-700" />
                )}
              </div>
            </div>
          );
        })}

        {filteredCountries.length === 0 && (
          <div className="text-center py-10 text-zinc-500 text-xs">
            No countries found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
