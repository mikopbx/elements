import { safeParse, safeStringify } from '@stoplight/json';
import { Box, Button, Flex, Icon, Image, Link, Menu, MenuItems, Panel } from '@stoplight/mosaic';
import { capitalize } from 'lodash';
import * as React from 'react';
import formatXml from 'xml-formatter';

import { HttpCodeDescriptions } from '../../../constants';
import { t } from '../../../utils/i18n';
import { getHttpCodeColor } from '../../../utils/http';
import { ResponseCodeViewer } from './ReponseCodeViewer';

export interface ResponseState {
  status: number;
  bodyText?: string;
  contentType: string | null;
  blob?: Blob;
}

export interface ErrorState {
  error: Error;
}

type ContentType = 'image' | 'json' | 'xml' | 'text';
type BodyFormat = 'preview' | 'raw';

const bodyFormatMap: Record<ContentType, BodyFormat[]> = {
  image: ['preview'],
  json: ['preview', 'raw'],
  xml: ['preview', 'raw'],
  text: ['raw'],
};

const regex: Record<ContentType, RegExp> = {
  image: /image\/(.?)*(jpeg|gif|png|svg)/,
  json: /application\/(.?)*json/,
  xml: /(text|application)\/(.?)*(xml|html)/,
  text: /text\/.*/,
};

export function getResponseType(contentType: string) {
  return Object.keys(regex).find(type => {
    const reg = regex[type as ContentType];
    return reg.test(contentType);
  }) as ContentType | undefined;
}

function parseBody(body: string, type: ContentType) {
  switch (type) {
    case 'json':
      return safeStringify(safeParse(body), undefined, 2) || body;
    case 'xml':
      try {
        return formatXml(body);
      } catch {
        return body;
      }
    default:
      return body;
  }
}

export const TryItResponse: React.FC<{ response: ResponseState }> = ({ response }) => {
  const contentType = response.contentType;
  const responseType = contentType ? getResponseType(contentType) : undefined;
  const bodyFormats = responseType ? bodyFormatMap[responseType] : [];

  const [bodyFormat, setBodyFormat] = React.useState<BodyFormat | undefined>(
    bodyFormats.length ? bodyFormats[0] : undefined,
  );

  return (
    <Panel defaultIsOpen>
      <Panel.Titlebar
        rightComponent={
          bodyFormat &&
          bodyFormats.length > 1 && <ResponseMenu types={bodyFormats} type={bodyFormat} onChange={setBodyFormat} />
        }
      >
        {t('sl_Response')}
      </Panel.Titlebar>
      <Panel.Content>
        <div>
          <div className={`sl-mb-3 sl-text-${getHttpCodeColor(response.status)}`}>
            {`${response.status} ${HttpCodeDescriptions[response.status] ?? ''}`}
          </div>
          {response.bodyText && responseType && ['json', 'xml', 'text'].includes(responseType) ? (
            <ResponseCodeViewer
              language="json"
              value={
                responseType && bodyFormat === 'preview'
                  ? parseBody(response.bodyText, responseType)
                  : response.bodyText
              }
            />
          ) : response.blob && responseType === 'image' ? (
            <Flex justifyContent="center">
              <Image src={URL.createObjectURL(response.blob)} alt="response image" />
            </Flex>
          ) : !response.bodyText ? null : (
            <p>
              <Box as={Icon} icon={['fas', 'exclamation-circle']} mr={2} />
              {t('sl_NoSupportedResponseBody')}
            </p>
          )}
        </div>
      </Panel.Content>
    </Panel>
  );
};

const ResponseMenu: React.FC<{
  types: BodyFormat[];
  type: BodyFormat;
  onChange: (type: BodyFormat) => void;
}> = ({ types, type, onChange }) => {
  const menuItems = React.useMemo(() => {
    const items: MenuItems = types.map(type => ({
      id: type,
      title: capitalize(type),
      onPress: () => onChange(type),
    }));

    return items;
  }, [types, onChange]);

  return (
    <Menu
      aria-label={t('sl_BodyFormat')}
      items={menuItems}
      renderTrigger={({ isOpen }) => (
        <Button appearance="minimal" size="sm" iconRight={['fas', 'sort']} active={isOpen}>
          {type === 'preview' ? t('sl_Preview') : t('sl_Raw')}
        </Button>
      )}
    />
  );
};

export const ResponseError: React.FC<{ state: ErrorState }> = ({ state: { error } }) => (
  <Panel defaultIsOpen>
    <Panel.Titlebar>{t('sl_Error')}</Panel.Titlebar>
    <Panel.Content>{isNetworkError(error) ? <NetworkErrorMessage /> : <p>{error.message}</p>}</Panel.Content>
  </Panel>
);

const NetworkErrorMessage = () => (
  <>
    <p className="sl-pb-2">
      <strong>{t('sl_NetworkError')}</strong>
    </p>

    <p className="sl-pb-2">{t('sl_NetworkErrorStep1')}</p>

    <p className="sl-pb-2">{t('sl_NetworkErrorStep2')}</p>

    <p>
      {t('sl_NetworkErrorStep3')}{' '}
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
        fontWeight="semibold"
      >
        {t('sl_CORS')}
      </Link>
      .
    </p>
  </>
);

export class NetworkError extends Error {}

const isNetworkError = (error: Error) => error instanceof NetworkError;
