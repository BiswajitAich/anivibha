import { load } from 'cheerio';

export const GET = async (request: Request) => {
    const url = new URL(request.url || '')
    const episodeId = url.searchParams.get("episodeId");
    const baseUrl = 'https://gogoanime3.net';

    const fetchEpisodeServers = async (episodeId: string): Promise<any[]> => {
        // console.log(episodeId)

        try {
            if (!episodeId.startsWith(baseUrl)) episodeId = `${baseUrl}/${episodeId}`;

            const response = await fetch(episodeId);
            const data = await response.text();
            const $ = load(data);

            const servers: any[] = [];

            $('div.anime_video_body > div.anime_muti_link > ul > li').each((i, el) => {
                let url = $(el).find('a').attr('data-video');
                if (!url?.startsWith('http')) url = `https:${url}`;

                servers.push({
                    name: $(el).find('a').text().replace('Choose this server', '').trim(),
                    url: url,
                });
            });

            return servers;
        } catch (err) {
            throw new Error('Episode not found.');
        }
    };



    try {
        const servers = await fetchEpisodeServers(String(episodeId));
        
        return new Response(JSON.stringify(servers), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};

