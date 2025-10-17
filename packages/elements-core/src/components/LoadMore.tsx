import { Button, Flex, Text } from '@stoplight/mosaic';
import * as React from 'react';

import { t } from '../utils/i18n';

interface LoadMoreProps {
  loading: boolean;
  onClick: () => void;
}

export const LoadMore: React.FC<LoadMoreProps> = ({ loading, onClick }) => {
  return (
    <Flex flexDirection="col" justifyContent="center" alignItems="center" style={{ height: '400px' }}>
      <Button aria-label="load-example" onPress={onClick} appearance="minimal" loading={loading} disabled={loading}>
        {loading ? t('sl_Loading') : t('sl_LoadExamples')}
      </Button>
      <Text fontSize="base" textAlign="center">
        {t('sl_LargeExamplesNotRendered')}
      </Text>
    </Flex>
  );
};
