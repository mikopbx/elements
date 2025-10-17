import { Box, FieldButton, Menu, MenuActionItem, MenuItems, MenuItemWithSubmenu } from '@stoplight/mosaic';
import { IHttpOperation, IHttpOperationResponse } from '@stoplight/types';
import { uniq } from 'lodash';
import * as React from 'react';

import { t } from '../../../utils/i18n';
import { MockingOptions } from './mocking-utils';

interface MockingButtonProps {
  operation: IHttpOperation;
  options: MockingOptions;
  onOptionsChange: (data: MockingOptions) => void;
}

export const MockingButton: React.FC<MockingButtonProps> = ({
  operation,
  options: { code, example, dynamic },
  onOptionsChange,
}) => {
  const operationResponses = operation.responses;

  const setMockingOptions = React.useCallback(
    ({ code, example, dynamic }: Omit<MockingOptions, 'isEnabled'>) => {
      onOptionsChange({ code, example, dynamic });
    },
    [onOptionsChange],
  );

  const menuItems = React.useMemo(() => {
    const items: MenuItems = operationResponses
      ?.filter(operationResponse => Number.isInteger(parseFloat(operationResponse.code)))
      ?.map(generateOperationResponseMenu);

    function generateOperationResponseMenu(operationResponse: IHttpOperationResponse) {
      const menuId = `response-${operationResponse.code}`;
      const isActive = operationResponse.code === code;
      const exampleKeys = uniq(operationResponse.contents?.flatMap(c => c.examples || []).map(example => example.key));

      const exampleChildren: MenuActionItem[] = exampleKeys?.map(exampleKey => ({
        id: `${menuId}-example-${exampleKey}`,
        title: exampleKey,
        isChecked: isActive && exampleKey === example,
        onPress: () => {
          setMockingOptions({ code: operationResponse.code, example: exampleKey });
        },
      }));

      const generationModeItems: MenuActionItem[] = [
        {
          id: `${menuId}-gen-static`,
          title: t('sl_StaticallyGenerated'),
          isChecked: isActive && dynamic === false,
          onPress: () => {
            setMockingOptions({ code: operationResponse.code, dynamic: false });
          },
        },
        {
          id: `${menuId}-gen-dynamic`,
          title: t('sl_DynamicallyGenerated'),
          isChecked: isActive && dynamic === true,
          onPress: () => {
            setMockingOptions({ code: operationResponse.code, dynamic: true });
          },
        },
      ];

      const menuItem: MenuItemWithSubmenu = {
        id: menuId,
        isChecked: isActive,
        title: operationResponse.code,
        onPress: () => {
          setMockingOptions({ code: operationResponse.code, dynamic: false });
        },
        children: [
          { type: 'group', children: generationModeItems },
          { type: 'group', title: t('sl_Examples'), children: exampleChildren },
        ],
      };

      return menuItem;
    }

    return items;
  }, [code, dynamic, example, operationResponses, setMockingOptions]);

  return (
    <Box>
      <Menu
        aria-label={t('sl_MockSettings')}
        items={menuItems}
        renderTrigger={({ isOpen }) => (
          <FieldButton active={isOpen} size="sm">
            {t('sl_MockSettings')}
          </FieldButton>
        )}
      />
    </Box>
  );
};
