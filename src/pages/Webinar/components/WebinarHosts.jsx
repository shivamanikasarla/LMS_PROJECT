import { FiPlus, FiTrash2, FiUser, FiImage } from 'react-icons/fi';
import './SectionStyles.css';

const WebinarHosts = ({ hosts, setHosts }) => {

    const addHost = () => {
        setHosts([...hosts, { id: Date.now(), name: '', bio: '', image: null }]);
    };

    const updateHost = (id, field, value) => {
        setHosts(hosts.map(h => h.id === id ? { ...h, [field]: value } : h));
    };

    const removeHost = (id) => {
        setHosts(hosts.filter(h => h.id !== id));
    };

    const handleImageUpload = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            updateHost(id, 'image', url);
        }
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <div className="section-title">Webinar hosts</div>
                <button type="button" className="btn-add-new" onClick={addHost}>
                    <FiPlus /> Add new
                </button>
            </div>

            {hosts.length > 0 ? (
                <>
                    <div className="table-header grid-hosts">
                        <div className="header-cell">PICTURE</div>
                        <div className="header-cell">NAME</div>
                        <div className="header-cell">BIO</div>
                        <div className="header-cell"></div>
                    </div>
                    <div className="hosts-list">
                        {hosts.map(host => (
                            <div key={host.id} className="list-item grid-hosts">
                                <label className="item-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleImageUpload(host.id, e)}
                                    />
                                    {host.image ? (
                                        <img src={host.image} alt={host.name} />
                                    ) : (
                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Default Host" style={{ opacity: 0.6 }} />
                                    )}
                                </label>
                                <input
                                    type="text"
                                    className="item-input"
                                    placeholder="Enter host name"
                                    value={host.name}
                                    onChange={(e) => updateHost(host.id, 'name', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="item-input"
                                    placeholder="Enter host bio"
                                    value={host.bio}
                                    onChange={(e) => updateHost(host.id, 'bio', e.target.value)}
                                />
                                <button type="button" className="btn-remove" onClick={() => removeHost(host.id)}>
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="empty-state" onClick={addHost}>
                    <FiPlus className="add-icon-large" />
                    <span>List hosts for your webinar page</span>
                </div>
            )}
        </div>
    );
};

export default WebinarHosts;
