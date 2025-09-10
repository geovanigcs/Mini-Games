'use client';

import { useState } from 'react';
import { Download, Upload, X, Save } from 'lucide-react';

interface AvatarEditorProps {
  currentAvatarUrl?: string;
  characterName: string;
  onSave: (avatarUrl: string) => Promise<void>;
  onCancel: () => void;
  isCreation?: boolean;
}

export default function AvatarEditor({ 
  currentAvatarUrl, 
  characterName, 
  onSave, 
  onCancel,
  isCreation = false 
}: AvatarEditorProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onSave(avatarUrl);
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!avatarUrl) return;

    try {
      // Fetch da imagem
      const response = await fetch(avatarUrl);
      if (!response.ok) throw new Error('Falha ao baixar imagem');

      // Converter para blob
      const blob = await response.blob();
      
      // Criar URL temporária
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Criar link temporário e fazer download
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Determinar extensão da imagem
      const contentType = response.headers.get('content-type') || '';
      let extension = 'png';
      if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = 'jpg';
      else if (contentType.includes('gif')) extension = 'gif';
      else if (contentType.includes('webp')) extension = 'webp';
      
      link.download = `${characterName.toLowerCase().replace(/\s+/g, '_')}_avatar.${extension}`;
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      alert('Erro ao fazer download da imagem. Verifique se a URL é válida.');
    }
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  const handleImageLoad = () => {
    setPreviewError(false);
  };

  const handleUrlChange = (value: string) => {
    setAvatarUrl(value);
    setPreviewError(false);
  };

  const commonImageUrls = [
    'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Guerreiro',
    'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=Mago',
    'https://via.placeholder.com/200x200/2ECC71/FFFFFF?text=Ranger',
    'https://via.placeholder.com/200x200/E74C3C/FFFFFF?text=Ladino',
    'https://via.placeholder.com/200x200/F39C12/FFFFFF?text=Bardo',
    'https://via.placeholder.com/200x200/9B59B6/FFFFFF?text=Clerigo'
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 rounded-xl border border-amber-500/30 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-amber-200 flex items-center gap-2">
            🖼️ {isCreation ? 'Adicionar' : 'Editar'} Avatar
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <label className="block text-amber-300 font-semibold mb-2">
            Preview do Avatar
          </label>
          <div className="flex justify-center mb-4">
            {avatarUrl && !previewError ? (
              <img
                src={avatarUrl}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-amber-400 shadow-lg"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl border-4 border-amber-400 shadow-lg">
                {characterName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* URL Input */}
        <div className="mb-4">
          <label className="block text-amber-300 font-semibold mb-2">
            URL da Imagem
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://exemplo.com/avatar.jpg"
              className="flex-1 px-4 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-400/50 focus:border-amber-400 focus:outline-none"
            />
            {avatarUrl && (
              <button
                onClick={handleDownload}
                className="p-2 bg-green-600/20 hover:bg-green-600/40 text-green-200 rounded-lg transition-colors"
                title="Baixar imagem"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>
          {previewError && (
            <p className="text-red-300 text-sm mt-1">
              ❌ Não foi possível carregar a imagem. Verifique se a URL é válida.
            </p>
          )}
        </div>

        {/* Exemplos de URLs */}
        <div className="mb-6">
          <label className="block text-amber-300 font-semibold mb-2">
            Exemplos Rápidos
          </label>
          <div className="grid grid-cols-2 gap-2">
            {commonImageUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => handleUrlChange(url)}
                className="p-2 bg-black/20 hover:bg-black/40 border border-amber-500/20 hover:border-amber-400/40 rounded-lg text-amber-200 text-sm transition-colors"
              >
                {url.includes('Guerreiro') ? '⚔️ Guerreiro' :
                 url.includes('Mago') ? '🔮 Mago' :
                 url.includes('Ranger') ? '🏹 Ranger' :
                 url.includes('Ladino') ? '🗡️ Ladino' :
                 url.includes('Bardo') ? '🎵 Bardo' :
                 '✝️ Clérigo'}
              </button>
            ))}
          </div>
        </div>

        {/* Dicas */}
        <div className="mb-6 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-200 text-sm">
            💡 <strong>Dicas:</strong>
          </p>
          <ul className="text-blue-300 text-xs mt-1 space-y-1">
            <li>• Use URLs de imagens públicas (imgur, pinterest, etc.)</li>
            <li>• Formatos suportados: JPG, PNG, GIF, WEBP</li>
            <li>• Imagens quadradas funcionam melhor</li>
            <li>• Clique no botão ⬇️ para baixar a imagem</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800/50 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Avatar
              </>
            )}
          </button>
          
          <button
            onClick={onCancel}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
