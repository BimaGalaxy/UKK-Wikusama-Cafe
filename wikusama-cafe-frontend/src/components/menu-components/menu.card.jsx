import React from 'react'

export default function MenuCard() {
    return (
        <div class="group flex w-full max-w-xs flex-col overflow-hidden border border-gray-100 bg-white shadow-md">
            <a class="relative flex h-60 overflow-hidden" href="#">
                <img class="absolute top-0 right-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1072&q=80" alt="product image" />
            </a>
            <div class="mt-4 px-5 pb-5">
                <a href="#">
                    <h5 class=" tracking-tight text-slate-900">Lululemon Comfort Tee - White</h5>
                </a>
                <div class="mt-2 mb-5 flex items-center justify-between">
                    <p>
                        <span class="text-xl font-bold text-slate-900">Rp.79000</span>
                    </p>
                </div>
                <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                    Edit
                </button>
                <button
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                >
                    Hapus
                </button>
            </div>
        </div>
    )
}
