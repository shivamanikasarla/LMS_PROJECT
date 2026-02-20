import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

const ResourceFilters = ({
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    categories = []
}) => {
    const [localSearch, setLocalSearch] = useState(searchTerm);

    // Simple debounce (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(localSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearch, setSearchTerm]);

    return (
        <div className="row g-3 mb-4">
            {/* SEARCH */}
            <div className="col-md-6">
                <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                        <Search size={18} className="text-muted" />
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Search by title, author, ISBN, or barcode"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* CATEGORY FILTER */}
            <div className="col-md-3">
                <select
                    className="form-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="ALL">All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ResourceFilters;
