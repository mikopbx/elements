import { Flex, Input, Panel, Text } from '@stoplight/mosaic';
import * as React from 'react';

import { t } from '../../../utils/i18n';

interface BasicAuthProps {
  onChange: (value: string) => void;
  value: string;
}

export const BasicAuth: React.FC<BasicAuthProps> = ({ onChange, value }) => {
  const [username = '', password = ''] = decode(value).split(':');

  const onCredentialsChange = (username: string, password: string) => {
    onChange(encode(`${username}:${password}`));
  };

  return (
    <Panel.Content className="ParameterGrid" data-test="auth-try-it-row">
      <div>{t('sl_Username')}</div>
      <Text mx={3}>:</Text>
      <Flex flex={1}>
        <Input
          style={{ paddingLeft: 15 }}
          aria-label={t('sl_Username')}
          appearance="minimal"
          flex={1}
          placeholder={t('sl_username')}
          value={username}
          type="text"
          required
          onChange={e => onCredentialsChange(e.currentTarget.value, password)}
        />
      </Flex>
      <div>{t('sl_Password')}</div>
      <Text mx={3}>:</Text>
      <Flex flex={1}>
        <Input
          style={{ paddingLeft: 15 }}
          aria-label={t('sl_Password')}
          appearance="minimal"
          flex={1}
          placeholder={t('sl_password')}
          value={password}
          type="password"
          required
          onChange={e => onCredentialsChange(username, e.currentTarget.value)}
        />
      </Flex>
    </Panel.Content>
  );
};

function encode(value: string) {
  return btoa(value);
}

function decode(encoded: string) {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
}
