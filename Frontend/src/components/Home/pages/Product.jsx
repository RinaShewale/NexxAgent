import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Product = () => {
  return (
    <div className="min-h-screen bg-zinc-50 p-8 md:p-24 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Visual Side */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white aspect-[4/5] rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center border border-zinc-100">
             <div className="text-zinc-200 font-bold text-9xl select-none">OBJ_01</div>
             {/* Replace with <img> tag */}
          </div>
        </div>

        {/* Right: Info Side */}
        <div className="space-y-8">
          <div>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Limited Edition
            </span>
            <h2 className="text-6xl font-black text-zinc-900 mt-4 tracking-tight">The Aero <br/>Chair v.1</h2>
          </div>
          
          <p className="text-lg text-zinc-500 max-w-md">
            Ergonomically engineered for creative professionals. Carbon fiber frame, 
            breathable mesh, and a lifetime of comfort.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-4xl font-light text-zinc-900">$899.00</span>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-xl hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-zinc-200">
              <ShoppingBag size={20} />
              Add to Cart
            </button>
          </div>

          <div className="pt-8 border-t border-zinc-200 flex gap-4">
             <button className="text-zinc-400 hover:text-zinc-900 flex items-center gap-2 text-sm font-semibold transition-colors">
               Specifications <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;