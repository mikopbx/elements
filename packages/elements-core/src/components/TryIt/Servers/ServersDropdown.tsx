import { faServer } from '@fortawesome/free-solid-svg-icons';
import { FieldButton, Menu, MenuItem } from '@stoplight/mosaic';
import type { IServer } from '@stoplight/types';
import { useAtom } from 'jotai';
import * as React from 'react';

import { t } from '../../../utils/i18n';
import { getServerUrlWithVariableValues } from '../../../utils/http-spec/IServer';
import { chosenServerAtom } from '../chosenServer';
import { useServerVariables } from './useServerVariables';

export type ServersDropdownProps = {
  servers: IServer[];
};

export const ServersDropdown = ({ servers }: ServersDropdownProps) => {
  const [chosenServer, setChosenServer] = useAtom(chosenServerAtom);
  const { serverVariables } = useServerVariables();

  const serverItems: MenuItem[] = [
    {
      type: 'option_group',
      title: t('sl_Servers'),
      value: chosenServer?.url || '',
      onChange: url => {
        const server = servers.find(server => server.url === url);
        setChosenServer(server);
      },
      children: [
        ...servers.map((server, i) => ({
          id: server.url,
          title: server.description,
          description: getServerUrlWithVariableValues(server, serverVariables),
          value: server.url,
        })),
      ],
    },
  ];

  return (
    <Menu
      aria-label={t('sl_Server')}
      items={serverItems}
      closeOnPress
      renderTrigger={({ isOpen }) => (
        <FieldButton icon={faServer} size="sm" active={isOpen}>
          {chosenServer?.description || t('sl_Server')}
        </FieldButton>
      )}
    />
  );
};

ServersDropdown.displayName = 'ServersDropdown';
