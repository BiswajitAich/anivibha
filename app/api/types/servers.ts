export interface ServerItem {
    name: string;
    id: string;
    type: string;
    serverId: string;
}

export interface Servers {
    serversSub: ServerItem[];
    serversDub: ServerItem[];
}
