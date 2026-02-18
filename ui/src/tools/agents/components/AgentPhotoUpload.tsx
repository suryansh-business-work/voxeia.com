import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import toast from 'react-hot-toast';
import { uploadAgentPhotoApi } from '../agents.api';

interface AgentPhotoUploadProps {
  agentId: string | undefined;
  currentImage: string | null;
  onImageUploaded: (url: string) => void;
  disabled?: boolean;
}

const AgentPhotoUpload = ({ agentId, currentImage, onImageUploaded, disabled }: AgentPhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !agentId) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const res = await uploadAgentPhotoApi(agentId, file);
      if (res.success && res.data?.image) {
        onImageUploaded(res.data.image);
        toast.success('Photo uploaded!');
      } else {
        toast.error(res.message || 'Upload failed');
        setPreview(null);
      }
    } catch {
      toast.error('Failed to upload photo');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const displayImage = preview || currentImage;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={displayImage || undefined}
          sx={{ width: 72, height: 72, bgcolor: 'primary.main' }}
        >
          {!displayImage && <SmartToyIcon sx={{ fontSize: 36 }} />}
        </Avatar>
        {uploading && (
          <CircularProgress
            size={28}
            sx={{ position: 'absolute', top: 22, left: 22, color: 'primary.main' }}
          />
        )}
        <IconButton
          size="small"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading || !agentId}
          sx={{
            position: 'absolute', bottom: -4, right: -4,
            bgcolor: 'primary.main', color: '#fff',
            width: 28, height: 28,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <PhotoCameraIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
      <Box>
        <Typography variant="body2" fontWeight={600}>Agent Photo</Typography>
        <Typography variant="caption" color="text.secondary">
          {agentId ? 'Click camera icon to upload (max 5MB)' : 'Save agent first to upload photo'}
        </Typography>
      </Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default AgentPhotoUpload;
