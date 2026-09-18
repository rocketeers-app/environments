import { Box, HardDrive, Mail, RefreshCw } from 'lucide-react';
import React from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { cn } from '@/lib/utils';
import AstroIcon from './AstroIcon';
import AWSIcon from './AWSIcon';
import BackblazeIcon from './BackblazeIcon';
import BitBucketIcon from './BitBucketIcon';
import BunnyIcon from './BunnyIcon';
import ClaudeIcon from './ClaudeIcon';
import ClickHouseIcon from './ClickHouseIcon';
import CloudflareIcon from './CloudflareIcon';
import ComposerIcon from './ComposerIcon';
import DigitalOceanIcon from './DigitalOceanIcon';
import DiscordIcon from './DiscordIcon';
import DjangoIcon from './DjangoIcon';
import DNSimpleIcon from './DNSimpleIcon';
import DockerIcon from './DockerIcon';
import DrupalIcon from './DrupalIcon';
import FastApiIcon from './FastApiIcon';
import FlaskIcon from './FlaskIcon';
import GithubIcon from './GithubIcon';
import GitLabIcon from './GitLabIcon';
import GoIcon from './GoIcon';
import GoogleCloudIcon from './GoogleCloudIcon';
import GoogleIcon from './GoogleIcon';
import HetznerIcon from './HetznerIcon';
import HtmlIcon from './HtmlIcon';
import LaravelHorizonIcon from './LaravelHorizonIcon';
import LaravelIcon from './LaravelIcon';
import LeasewebIcon from './LeasewebIcon';
import LinodeIcon from './LinodeIcon';
import MailgunIcon from './MailgunIcon';
import MailpitIcon from './MailpitIcon';
import MariaDBIcon from './MariaDBIcon';
import MemcachedIcon from './MemcachedIcon';
import MijnHostIcon from './MijnHostIcon';
import MysqlIcon from './MysqlIcon';
import N8nIcon from './N8nIcon';
import NameCheapIcon from './NameCheapIcon';
import NestJsIcon from './NestJsIcon';
import NextJsIcon from './NextJsIcon';
import NginxIcon from './NginxIcon';
import NodeJsIcon from './NodeJsIcon';
import NpmIcon from './NpmIcon';
import NuxtIcon from './NuxtIcon';
import OnePasswordIcon from './OnePasswordIcon';
import PHPIcon from './PHPIcon';
import PlanetScale from './PlanetScale';
import PlausibleIcon from './PlausibleIcon';
import PostgreSQLIcon from './PostgreSQLIcon';
import PostHogIcon from './PostHogIcon';
import PostmarkIcon from './PostmarkIcon';
import PythonIcon from './PythonIcon';
import RailsIcon from './RailsIcon';
import RealtimeRegisterIcon from './RealtimeRegisterIcon';
import RedisIcon from './RedisIcon';
import RemixIcon from './RemixIcon';
import ResendIcon from './ResendIcon';
import RubyIcon from './RubyIcon';
import RustIcon from './RustIcon';
import SendGridIcon from './SendGridIcon';
import SpaceshipIcon from './SpaceshipIcon';
import StatamicIcon from './StatamicIcon';
import SupervisorIcon from './SupervisorIcon';
import SvelteKitIcon from './SvelteKitIcon';
import SymfonyIcon from './SymfonyIcon';
import TelegramIcon from './TelegramIcon';
import TinybirdIcon from './TinybirdIcon';
import TypesenseIcon from './TypesenseIcon';
import UbuntuIcon from './UbuntuIcon';
import UfwIcon from './UfwIcon';
import VectorIcon from './VectorIcon';
import ViteIcon from './ViteIcon';
import VultrIcon from './VultrIcon';
import WordPressIcon from './WordPressIcon';

export function IconProvider({
    iconType,
    className: iconClassName,
    ...props
}: { iconType: string; className?: string } & React.SVGProps<SVGSVGElement>) {
    const isDark = useDarkMode();
    const className = cn('rounded-[22%]', iconClassName);

    switch (iconType) {
        case 'github':
            return <GithubIcon className={className} {...props} />;
        case 'gitlab':
            return (
                <GitLabIcon isDark={isDark} className={className} {...props} />
            );
        case 'bitbucket':
            return (
                <BitBucketIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'aws':
        case 'aws-s3':
        case 'aws-ses':
            return <AWSIcon isDark={isDark} className={className} {...props} />;
        case 'digitalocean':
        case 'digitalocean-spaces':
            return (
                <DigitalOceanIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'gcp':
        case 'google-cloud':
        case 'google-cloud-platform':
            return <GoogleCloudIcon className={className} {...props} />;
        case 'google':
        case 'google-pagespeed':
            return <GoogleIcon className={className} {...props} />;
        case 'docker':
            return <DockerIcon className={className} {...props} />;
        case 'drupal':
            return <DrupalIcon className={className} {...props} />;
        case 'hetzner':
        case 'hetzner-spaces':
            return (
                <HetznerIcon isDark={isDark} className={className} {...props} />
            );
        case 'laravel-horizon':
            return <LaravelHorizonIcon className={className} {...props} />;
        case 'laravel':
            return <LaravelIcon className={className} {...props} />;
        case 'linode':
            return <LinodeIcon className={className} {...props} />;
        case 'leaseweb':
        case 'leaseweb-object-storage':
            return (
                <LeasewebIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'vultr':
            return <VultrIcon className={className} {...props} />;
        case 'claude':
        case 'anthropic':
            return <ClaudeIcon className={className} {...props} />;
        case 'cloudflare':
        case 'cloudflare-r2':
            return (
                <CloudflareIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'composer':
        case 'packagist':
            return (
                <ComposerIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'npm':
            return <NpmIcon className={className} {...props} />;
        case 'dnsimple':
            return (
                <DNSimpleIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'bunny':
            return (
                <BunnyIcon isDark={isDark} className={className} {...props} />
            );
        case 'html':
        case 'static':
            return (
                <HtmlIcon isDark={isDark} className={className} {...props} />
            );
        case 'astro':
            return (
                <AstroIcon isDark={isDark} className={className} {...props} />
            );
        case 'vite':
            return <ViteIcon className={className} {...props} />;
        case 'go':
        case 'golang':
            return <GoIcon className={className} {...props} />;
        case 'python':
            return <PythonIcon className={className} {...props} />;
        case 'fastapi':
            return <FastApiIcon className={className} {...props} />;
        case 'flask':
            return (
                <FlaskIcon isDark={isDark} className={className} {...props} />
            );
        case 'mariadb':
            return <MariaDBIcon className={className} {...props} />;
        case 'mysql':
            return <MysqlIcon className={className} {...props} />;
        case 'namecheap':
            return (
                <NameCheapIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'nginx':
            return <NginxIcon className={className} {...props} />;
        case 'redis':
            return <RedisIcon className={className} {...props} />;
        case 'supervisor':
            return <SupervisorIcon className={className} {...props} />;
        case 'rocketeers':
            return <AppLogoIcon className={className} {...props} />;
        case 'memcached':
            return <MemcachedIcon className={className} {...props} />;
        case 'mailpit':
            return (
                <MailpitIcon isDark={isDark} className={className} {...props} />
            );
        case 'n8n':
            return <N8nIcon className={className} {...props} />;
        case 'plausible':
            return <PlausibleIcon className={className} {...props} />;
        case 'typesense':
            return <TypesenseIcon className={className} {...props} />;
        case 'vector':
            return <VectorIcon className={className} {...props} />;
        case 'mailgun':
            return <MailgunIcon className={className} {...props} />;
        case 'posthog':
            return <PostHogIcon className={className} {...props} />;
        case 'postmark':
            return <PostmarkIcon className={className} {...props} />;
        case 'resend':
            return <ResendIcon className={className} {...props} />;
        case 'postgresql':
            return <PostgreSQLIcon className={className} {...props} />;
        case 'click-house':
        case 'clickhouse':
            return (
                <ClickHouseIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'tinybird':
            return (
                <TinybirdIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'php':
            return <PHPIcon isDark={isDark} className={className} {...props} />;
        case 'planetscale':
            return (
                <PlanetScale isDark={isDark} className={className} {...props} />
            );
        case 'spaceship':
            return (
                <SpaceshipIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'realtime-register':
            return (
                <RealtimeRegisterIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'mijn-host':
            return (
                <MijnHostIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'sendgrid':
            return <SendGridIcon className={className} {...props} />;
        case 'statamic':
            return <StatamicIcon className={className} {...props} />;
        case 'symfony':
            return (
                <SymfonyIcon isDark={isDark} className={className} {...props} />
            );
        case 'backblaze':
            return <BackblazeIcon className={className} {...props} />;
        case 'discord':
            return <DiscordIcon className={className} {...props} />;
        case 'telegram':
            return <TelegramIcon className={className} {...props} />;
        case 'ufw':
            return <UfwIcon isDark={isDark} className={className} {...props} />;
        case 'wordpress':
            return <WordPressIcon className={className} {...props} />;
        case '1password':
            return (
                <OnePasswordIcon
                    isDark={isDark}
                    className={className}
                    {...props}
                />
            );
        case 'nextjs':
            return (
                <NextJsIcon isDark={isDark} className={className} {...props} />
            );
        case 'node':
        case 'nodejs':
            return <NodeJsIcon className={className} {...props} />;
        case 'nuxt':
        case 'nuxtjs':
            return <NuxtIcon className={className} {...props} />;
        case 'sveltekit':
            return <SvelteKitIcon className={className} {...props} />;
        case 'remix':
            return (
                <RemixIcon isDark={isDark} className={className} {...props} />
            );
        case 'nestjs':
            return <NestJsIcon className={className} {...props} />;
        case 'django':
            return (
                <DjangoIcon isDark={isDark} className={className} {...props} />
            );
        case 'rails':
            return <RailsIcon className={className} {...props} />;
        case 'ruby':
            return <RubyIcon className={className} {...props} />;
        case 'rust':
            return <RustIcon className={className} {...props} />;
        case 'ubuntu':
            return (
                <UbuntuIcon isDark={isDark} className={className} {...props} />
            );
        case 'mail':
            return <Mail className={className} />;
        case 'refresh-cw':
            return <RefreshCw className={className} />;
        case 'hard-drive':
            return <HardDrive className={className} />;
        default:
            return <Box className={className} />;
    }
}
