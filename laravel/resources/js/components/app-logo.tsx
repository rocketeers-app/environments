import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo({
    className = 'h-5 w-auto',
}: {
    className?: string;
}) {
    return <AppLogoIcon className={className} />;
}
