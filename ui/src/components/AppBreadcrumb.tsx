import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
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
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2 }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography key={item.label} color="text.primary" fontWeight={500}>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label}
            underline="hover"
            color="inherit"
            href={item.href || '#'}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default AppBreadcrumb;
