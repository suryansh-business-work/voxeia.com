import Box from '@mui/material/Box';

const TypingIndicator = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.6,
      px: 1.5,
      py: 1,
    }}
  >
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: 'grey.500',
          '@keyframes bounce': {
            '0%, 60%, 100%': { transform: 'translateY(0)' },
            '30%': { transform: 'translateY(-6px)' },
          },
          animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
        }}
      />
    ))}
  </Box>
);

export default TypingIndicator;
