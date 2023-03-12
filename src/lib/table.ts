import { ColumnDef } from "@tanstack/react-table";

export type TData = {
  id?: string;
  uid: string;
  song: {
    name: string;
    composer: string;
    composerUrl: string;
  },
  map: {
    easy: number | string;
    normal: number | string;
    hard: number | string;
    creator: string;
    desc: string;
  }
};

export const COLUMNS: ColumnDef<any>[] = [
  {
    header: "曲名",
    accessorKey: "song.name",
  },
  {
    header: "作曲者",
    accessorKey: "song.composer",
  },
  {
    header: "譜面制作者",
    accessorKey: "map.creator",
  },
  {
    header: '難易度',
    columns: [
      {
        header: 'EASY',
        accessorKey: "map.easy"
      },
      {
        header: 'NORMAL',
        accessorKey: "map.normal"
      },
      {
        header: 'HARD',
        accessorKey: "map.hard"
      }
    ]
  },
  {
    header: 'お気に入り',
    accessorKey: "favoritesCount"
  }
];

export const USERCOLUMNS: ColumnDef<any>[] = [
  {
    header: "UID",
    accessorKey: "uid",
  },
  {
    header: "名前",
    accessorKey: "displayName",
  },
  {
    header: "メールアドレス",
    accessorKey: "email",
  },
  {
    header: "凍結",
    accessorKey: "disabled"
  },
  {
    header: "ロール",
    accessorKey: "customClaims.roles"
  }
]