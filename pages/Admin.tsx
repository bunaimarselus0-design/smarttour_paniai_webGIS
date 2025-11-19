import React, { useState } from 'react';
import { Category, Destination } from '../types';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

interface AdminProps {
  destinations: Destination[];
  setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
}

const Admin: React.FC<AdminProps> = ({ destinations, setDestinations }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Destination>>({
    name: '',
    category: Category.ALAM,
    description: '',
    rating: 4.0,
    latitude: -3.9,
    longitude: 136.3,
    features: [],
    image: 'https://picsum.photos/800/600'
  });
  const [featureInput, setFeatureInput] = useState('');

  const handleOpenModal = (dest?: Destination) => {
    if (dest) {
      setEditingId(dest.id);
      setFormData(dest);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        category: Category.ALAM,
        description: '',
        rating: 4.0,
        latitude: -3.9,
        longitude: 136.3,
        features: [],
        image: 'https://picsum.photos/800/600'
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setDestinations(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) return;

    if (editingId) {
      setDestinations(prev => prev.map(d => d.id === editingId ? { ...d, ...formData } as Destination : d));
    } else {
      const newId = Math.max(...destinations.map(d => d.id)) + 1;
      setDestinations(prev => [...prev, { ...formData, id: newId } as Destination]);
    }
    setIsModalOpen(false);
  };

  const addFeature = () => {
    if (featureInput && formData.features) {
      setFormData({ ...formData, features: [...formData.features, featureInput] });
      setFeatureInput('');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
            <p className="text-gray-500">Kelola data wisata SmartTour Paniai</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-paniai-600 hover:bg-paniai-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Tambah Data
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b">
                  <th className="p-4">Nama</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Lokasi (Lat, Long)</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{dest.name}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                         dest.category === Category.ALAM ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {dest.category}
                      </span>
                    </td>
                    <td className="p-4">{dest.rating}</td>
                    <td className="p-4 text-gray-500 text-sm">{dest.latitude}, {dest.longitude}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(dest)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(dest.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingId ? 'Edit Destinasi' : 'Tambah Destinasi Baru'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Destinasi</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-paniai-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as Category})}
                      className="w-full border rounded-md p-2"
                    >
                      <option value={Category.ALAM}>Alam</option>
                      <option value={Category.BUDAYA}>Budaya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      max="5"
                      value={formData.rating}
                      onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})}
                      className="w-full border rounded-md p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-paniai-500 outline-none"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input 
                      type="number" 
                      value={formData.latitude}
                      onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                      className="w-full border rounded-md p-2"
                    />
                   </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input 
                      type="number" 
                      value={formData.longitude}
                      onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                      className="w-full border rounded-md p-2"
                    />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Fitur (Tags)</label>
                   <div className="flex gap-2 mb-2">
                     <input 
                       type="text" 
                       value={featureInput}
                       onChange={e => setFeatureInput(e.target.value)}
                       className="flex-grow border rounded-md p-2"
                       placeholder="Contoh: danau"
                     />
                     <button onClick={addFeature} type="button" className="bg-gray-200 px-3 rounded hover:bg-gray-300">Add</button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {formData.features?.map((f, i) => (
                       <span key={i} className="bg-paniai-100 text-paniai-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                         {f} <button onClick={() => setFormData({...formData, features: formData.features?.filter((_, idx) => idx !== i)})}><X size={12}/></button>
                       </span>
                     ))}
                   </div>
                </div>
              </div>
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Batal</button>
                <button onClick={handleSave} className="px-4 py-2 bg-paniai-600 text-white rounded-lg hover:bg-paniai-700 flex items-center gap-2">
                  <Save size={18} /> Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
