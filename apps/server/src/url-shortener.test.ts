import { after, it } from 'node:test';
import assert from 'node:assert';
import { Miniflare } from 'miniflare';
import { UrlShortenerService } from './gen/proto/urlshortener/v1/urlshortener_pb';
import { createConnectTransport } from '@connectrpc/connect-node';
import { createClient } from '@connectrpc/connect';

it('should shorten and expand', async () => {
	const mf = new Miniflare({
		scriptPath: './dist/index.js',
		modules: true,
		kvNamespaces: ['STORE'],
		compatibilityDate: '2023-10-02', // REQUIRED for using ReadableStream
	});
	after(() => mf.dispose());
	const baseUrl = (await mf.ready).toString().slice(0, -1);
	const transport = createConnectTransport({
		baseUrl: baseUrl,
		httpVersion: '1.1',
		useBinaryFormat: true,
	});
	const client = createClient(UrlShortenerService, transport);
	const { url: shortUrl } = await client.shorten({ url: 'https://google.com' });
	const { url: longUrl } = await client.expand({ url: shortUrl });
	assert.strictEqual(longUrl, 'https://google.com');
});
