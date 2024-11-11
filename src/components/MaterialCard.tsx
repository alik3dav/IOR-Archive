import React from 'react';
import { Pencil, Trash2, Copy, Check, Droplet } from 'lucide-react';
import { IORMaterial } from '../types/ior';
import { useIORStore } from '../store/iorStore';

interface MaterialCardProps {
  material: IORMaterial;
  onEdit: (material: IORMaterial) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material, onEdit }) => {
  const { isAdmin, deleteMaterial } = useIORStore();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(material.iorValue.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteMaterial(material.id);
    }
  };

  return (
    <div className="card p-6 animate-fade-in" role="article">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Droplet className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{material.name}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            title={copied ? "Copied!" : "Copy IOR value"}
            aria-label={copied ? "Copied!" : "Copy IOR value"}
          >
            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(material)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit material"
                aria-label="Edit material"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete material"
                aria-label="Delete material"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 space-x-2">
        <span className="badge-blue">
          IOR: {material.iorValue.toFixed(3)}
        </span>
        <span className="badge-gray">
          {material.category}
        </span>
      </div>
      {material.description && (
        <p className="mt-3 text-gray-600 line-clamp-2">{material.description}</p>
      )}
      <div className="mt-4 text-sm text-gray-500 grid grid-cols-2 gap-2">
        {material.wavelength && (
          <div className="flex items-center space-x-1">
            <span className="font-medium">Wavelength:</span>
            <span>{material.wavelength}nm</span>
          </div>
        )}
        {material.temperature && (
          <div className="flex items-center space-x-1">
            <span className="font-medium">Temperature:</span>
            <span>{material.temperature}°C</span>
          </div>
        )}
        {material.source && (
          <div className="col-span-2 text-xs text-gray-400 mt-2">
            Source: {material.source}
          </div>
        )}
      </div>
    </div>
  );
};