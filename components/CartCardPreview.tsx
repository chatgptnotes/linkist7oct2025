'use client';

interface CartCardPreviewProps {
  config: {
    firstName: string;
    lastName: string;
    title?: string;
    company?: string;
    mobile?: string;
    email?: string;
    website?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    profileImage?: string;
    backgroundImage?: string;
  };
  size?: 'small' | 'medium';
}

export default function CartCardPreview({ config, size = 'small' }: CartCardPreviewProps) {
  const getBackgroundStyle = () => {
    if (config.backgroundImage) {
      return {
        backgroundImage: `url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    };
  };

  const sizeClasses = {
    small: 'w-24 h-16',
    medium: 'w-32 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg overflow-hidden shadow-lg`}>
      <div
        className="w-full h-full relative text-white p-2"
        style={getBackgroundStyle()}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-1">
          <img src="/logo.svg" alt="Linkist" className="h-3 filter brightness-0 invert" />
          <div className="bg-red-500 text-white px-1 py-0.5 rounded text-xs font-bold">
            FOUNDER
          </div>
        </div>

        {/* Profile Image */}
        <div className="absolute top-3 right-1 w-4 h-4 bg-black rounded-full overflow-hidden border border-white/20">
          {config.profileImage ? (
            <img
              src={config.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {config.firstName?.[0]}{config.lastName?.[0]}
              </span>
            </div>
          )}
        </div>

        {/* Name and Title */}
        <div className="absolute bottom-1 left-1 right-1">
          <h3 className="text-xs font-bold text-white mb-0.5 truncate">
            {config.firstName} {config.lastName}
          </h3>
          <p className="text-xs text-gray-300 truncate">
            {config.title || 'Your Title'}
          </p>
        </div>

        {/* NFC Indicator */}
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-white/30 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
