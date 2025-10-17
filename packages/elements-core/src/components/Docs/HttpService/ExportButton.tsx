import { Box, Button, Menu, MenuActionItem, MenuItems } from '@stoplight/mosaic';
import * as React from 'react';

import { t } from '../../../utils/i18n';

type ExportMenuProps = Pick<MenuActionItem, 'href' | 'onPress'>;

export interface ExportButtonProps {
  original: ExportMenuProps;
  bundled: ExportMenuProps;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ original, bundled }) => {
  const menuItems = React.useMemo(() => {
    const items: MenuItems = [
      { id: 'original', title: t('sl_Original'), ...original },
      { id: 'bundled', title: t('sl_BundledReferences'), ...bundled },
    ];

    return items;
  }, [original, bundled]);

  return (
    <Box>
      <Menu
        aria-label={t('sl_Export')}
        items={menuItems}
        placement="bottom right"
        renderTrigger={({ isOpen }) => (
          <Button iconRight="chevron-down" appearance="default" ml={2} active={isOpen} size="sm">
            {t('sl_Export')}
          </Button>
        )}
      />
    </Box>
  );
};
