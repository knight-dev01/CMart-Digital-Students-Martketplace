import React from 'react';

// Trust Indicator: Verified Student Vendor Badge
export const VerifiedBadge = () => (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
        <svg className="mr-1 h-2 w-2 text-blue-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
        </svg>
        Verified Student Vendor
    </span>
);

// Campus Drops Component: Highlights new products
export const CampusDrops = ({ products }: { products: any[] }) => (
    <section className="my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔥 Campus Drops</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {products.map(product => (
                <div key={product.id} className="flex-none w-64 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <img src={product.images[0]?.image || '/placeholder.png'} alt={product.name} className="h-40 w-full object-cover" />
                    <div className="p-4">
                        <p className="text-xs text-indigo-600 font-semibold uppercase">{product.shop_name}</p>
                        <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
                        <p className="text-gray-600 font-medium">₦{product.price}</p>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>{product.view_count} students viewed</span>
                            <button className="text-pink-500 hover:text-pink-600">❤ {product.likes_count}</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

// Campus Activity Feed: Real-time event log
export const ActivityFeed = ({ activities }: { activities: any[] }) => (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 font-inter">Live Campus Activity</h3>
        <div className="space-y-4">
            {activities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3 text-sm">
                    <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-gray-700">
                        <span className="font-semibold">{activity.message}</span>
                        <span className="text-gray-400 ml-2 text-xs">{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                </div>
            ))}
        </div>
    </div>
);

// Shop Card: Trust and social focused
export const StudentShopCard = ({ shop }: { shop: any }) => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center">
        <div className="relative inline-block">
            <img src={shop.logo || '/default-logo.png'} alt={shop.shop_name} className="w-20 h-20 rounded-full mx-auto border-2 border-indigo-50" />
            {shop.vendor_is_verified && <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full"><VerifiedBadge /></div>}
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900">{shop.shop_name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mt-1">{shop.description}</p>
        <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-gray-400">
             <span>{shop.followers_count} followers</span>
             <span>•</span>
             <span>{shop.product_count || 0} items</span>
        </div>
        <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
            Follow Student Shop
        </button>
    </div>
);
