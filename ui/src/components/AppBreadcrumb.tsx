import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
}

const AppBreadcrumb = ({ items }: AppBreadcrumbProps) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 3,
          height: 16,
          bgcolor: 'primary.main',
          flexShrink: 0,
        }}
      />
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 14, color: 'text.secondary' }} />}
        sx={{ '& .MuiBreadcrumbs-li': { fontSize: '0.75rem' } }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return isLast ? (
            <Typography
              key={item.label}
              color="text.primary"
              sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.02em' }}
            >
              {item.label}
            </Typography>
          ) : (
            <Link
              key={item.label}
              underline="hover"
              color="text.secondary"
              href={item.href || '#'}
              sx={{ fontSize: '0.75rem', '&:hover': { color: 'primary.main' } }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default AppBreadcrumb;
