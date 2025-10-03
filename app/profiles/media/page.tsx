'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ImageIconMUI from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckIcon from '@mui/icons-material/Check';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Icon aliases
const Upload = CloudUploadIcon;
const X = CloseIcon;
const ImageIcon = ImageIconMUI;
const Video = VideocamIcon;
const File = InsertDriveFileIcon;
const Trash2 = DeleteIcon;
const Edit2 = EditIcon;
const Download = CloudDownloadIcon;
const Eye = VisibilityIcon;
const Grid = GridViewIcon;
const List = ViewListIcon;
const Search = SearchIcon;
const Filter = FilterListIcon;
const ChevronLeft = ChevronLeftIcon;
const Check = CheckIcon;
const FolderPlus = CreateNewFolderIcon;
const MoreVertical = MoreVertIcon;

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  uploadedAt: string;
  folder?: string;
  selected?: boolean;
}

interface Folder {
  id: string;
  name: string;
  count: number;
}

export default function MediaGallery() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Mock data
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'profile-photo.jpg',
      type: 'image',
      url: '/api/placeholder/200/200',
      size: '245 KB',
      uploadedAt: '2 hours ago',
      folder: 'profile'
    },
    {
      id: '2',
      name: 'company-logo.png',
      type: 'image',
      url: '/api/placeholder/200/200',
      size: '128 KB',
      uploadedAt: '1 day ago',
      folder: 'logos'
    },
    {
      id: '3',
      name: 'intro-video.mp4',
      type: 'video',
      url: '#',
      size: '5.2 MB',
      uploadedAt: '3 days ago',
      folder: 'videos'
    },
    {
      id: '4',
      name: 'portfolio.pdf',
      type: 'document',
      url: '#',
      size: '1.8 MB',
      uploadedAt: '1 week ago',
      folder: 'documents'
    }
  ]);

  const [folders] = useState<Folder[]>([
    { id: '1', name: 'All Media', count: mediaItems.length },
    { id: '2', name: 'Profile Pictures', count: 5 },
    { id: '3', name: 'Logos', count: 3 },
    { id: '4', name: 'Videos', count: 2 },
    { id: '5', name: 'Documents', count: 4 }
  ]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      console.log('Uploading file:', file.name);
      // Handle file upload here
    });
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedItems.length} selected items?`)) {
      setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
      case 'document':
        return <File className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
              <p className="text-gray-600 mt-2">Manage your profile media files</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Media
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Folders</h3>
              <div className="space-y-1">
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                      selectedFolder === folder.id
                        ? 'bg-red-50 text-red-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{folder.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {folder.count}
                    </span>
                  </button>
                ))}
              </div>
              <button className="w-full mt-4 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </button>
            </div>

            {/* Storage Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Storage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium">124 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium">876 MB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '12.4%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">12.4% of 1 GB used</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm">
              {/* Toolbar */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    {/* Filter */}
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">All Types</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                      <option value="document">Documents</option>
                    </select>

                    {selectedItems.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {selectedItems.length} selected
                        </span>
                        <button
                          onClick={handleDeleteSelected}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Grid/List */}
              <div className="p-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredItems.map(item => (
                      <div
                        key={item.id}
                        className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition ${
                          selectedItems.includes(item.id)
                            ? 'border-red-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleSelectItem(item.id)}
                      >
                        {/* Selection Checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                          <div className={`w-5 h-5 rounded border-2 ${
                            selectedItems.includes(item.id)
                              ? 'bg-red-500 border-red-500'
                              : 'bg-white border-gray-300'
                          } flex items-center justify-center`}>
                            {selectedItems.includes(item.id) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="aspect-square bg-gray-50 flex items-center justify-center">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            getItemIcon(item.type)
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{item.size}</span>
                            <span className="text-xs text-gray-500">{item.uploadedAt}</span>
                          </div>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                          <div className="flex space-x-1">
                            <button className="p-1 bg-white rounded shadow-sm hover:shadow-md">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-1 bg-white rounded shadow-sm hover:shadow-md">
                              <Download className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-1 bg-white rounded shadow-sm hover:shadow-md">
                              <MoreVertical className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredItems.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                          selectedItems.includes(item.id)
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectItem(item.id)}
                      >
                        <div className="flex-shrink-0 mr-4">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.size} • {item.uploadedAt}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded">
                            <Eye className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded">
                            <Download className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded">
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload Media</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center ${
                  dragActive ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to upload
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Support for JPG, PNG, GIF, MP4, PDF up to 10MB
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  Choose Files
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}