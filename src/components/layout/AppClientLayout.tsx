"use client";

// ** React Imports
import { ReactNode } from 'react';

// ** MUI Imports
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Core Layout Imports
import VerticalLayout from 'src/@core/layouts/VerticalLayout';
import { useSettings } from 'src/@core/hooks/useSettings';
import type { Settings } from 'src/@core/context/settingsContext'; // Import for explicit typing

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical';

// ** AppBar Content Import
import VerticalAppBarContent from 'src/layouts/components/vertical/AppBarContent';

// ** Theme Component Import
import ThemeComponent from 'src/@core/theme/ThemeComponent';

// ** Type for props that VerticalLayout passes to verticalAppBarContent
interface AppBarContentProps {
  hidden: boolean;
  settings: Settings;
  saveSettings: (values: Settings) => void;
  toggleNavVisibility: () => void;
}

interface Props {
  children: ReactNode;
}

const AppClientLayout = ({ children }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings();
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const verticalLayoutProps = {
    hidden: hidden,
    settings: settings,
    saveSettings: saveSettings,
    verticalNavItems: VerticalNavItems(),
    verticalAppBarContent: (props: AppBarContentProps) => (
      <VerticalAppBarContent
        hidden={hidden}
        settings={settings}
        saveSettings={saveSettings}
        toggleNavVisibility={props.toggleNavVisibility}
      />
    ),
  };

  return (
    <ThemeComponent settings={settings}>
      <VerticalLayout {...verticalLayoutProps}>{children}</VerticalLayout>
    </ThemeComponent>
  );
};

export default AppClientLayout;
