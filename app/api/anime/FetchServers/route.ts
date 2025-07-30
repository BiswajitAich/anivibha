import axios from 'axios';
import { load } from 'cheerio';
import { NextResponse } from 'next/server';
import { ServerItem } from '../../types/servers';
export const revalidate = 60;
export const GET = async (request: Request) => {
    const url = new URL(request.url || '');
    const episodeId = url.searchParams.get("episodeId");

    if (!episodeId) {
        return NextResponse.json({ error: 'Missing episodeId' }, { status: 400 });
    }

    const baseUrl = process.env.ANIME_BASEURL;
    const servers = process.env.SERVERS;
    if (!baseUrl) throw new Error("API not found!");

    const fetchEpisodeServers = async (episodeId: string) => {
        const x = episodeId.split('=');
        const id = x[1];

        try {
            const { data } = await axios.get(`${baseUrl}${servers}?episodeId=${id}`, {
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Referer": `${baseUrl}/watch/${episodeId}`,
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                        "AppleWebKit/537.36 (KHTML, like Gecko) " +
                        "Chrome/91.0.4472.124 Safari/537.36",
                },
            });

            // console.log("API Response:", data);

            if (!data.html) {
                throw new Error('No HTML content in response');
            }

            const $ = load(data.html);

            // console.log("Loaded HTML:", data.html);

            const parseServers = (selector: string): ServerItem[] => {
                const servers: ServerItem[] = [];

                $(selector).find('.item.server-item').each((_, element) => {
                    const server = $(element);
                    const serverName = server.find('a.btn').text().trim();

                    servers.push({
                        name: serverName,
                        id: server.attr('data-id') || '',
                        type: server.attr('data-type') || '',
                        serverId: server.attr('data-server-id') || '',
                    });
                });

                return servers;
            };

            return {
                serversSub: parseServers('.ps_-block.ps_-block-sub.servers-sub'),
                serversDub: parseServers('.ps_-block.ps_-block-sub.servers-dub'),
            };
        } catch (err) {
            console.error(`Error fetching servers: ${err}`);
            throw new Error('Failed to fetch episode servers.');
        }
    };

    try {
        const servers = await fetchEpisodeServers(episodeId);
        return NextResponse.json(servers, {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Final error:", error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};