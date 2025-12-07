export const questions = [
    {
        id: 1,
        text: "仕事において、あなたはどちらを好みますか？",
        choiceA: "新しいアイデアをゼロから考える",
        choiceB: "既存の手順や仕組みを改善する",
        type: "creative_vs_logic"
    },
    {
        id: 2,
        text: "チームでの役割について、どちらが自分に近いですか？",
        choiceA: "先頭に立って皆を引っ張りたい",
        choiceB: "サポート役として皆を支えたい",
        type: "leader_vs_supporter"
    },
    {
        id: 3,
        text: "キャリアの選択において重視するのは？",
        choiceA: "リスクを取ってでも大きな挑戦",
        choiceB: "安定した環境での着実な成果",
        type: "risk_vs_stability"
    },
    {
        id: 4,
        text: "得意なアプローチはどちらですか？",
        choiceA: "データや数字に基づいた分析",
        choiceB: "人の感情や文脈を読み解くこと",
        type: "data_vs_emotion"
    },
    {
        id: 5,
        text: "作業スタイルの好みは？",
        choiceA: "ひとりで集中して没頭したい",
        choiceB: "チームで議論しながら進めたい",
        type: "solo_vs_team"
    }
];

export const results = {
    // Simple logic: Predominantly A (Creative/Leader/Risk) vs B (Steady/Support/Logic)
    // For a 5-question simple test, we can just count As.
    export const questions = [
        {
            id: 1,
            text: "仕事において、あなたはどちらを好みますか？",
            choiceA: "新しいアイデアをゼロから考える",
            choiceB: "既存の手順や仕組みを改善する",
            type: "creative_vs_logic"
        },
        {
            id: 2,
            text: "チームでの役割について、どちらが自分に近いですか？",
            choiceA: "先頭に立って皆を引っ張りたい",
            choiceB: "サポート役として皆を支えたい",
            type: "leader_vs_supporter"
        },
        {
            id: 3,
            text: "キャリアの選択において重視するのは？",
            choiceA: "リスクを取ってでも大きな挑戦",
            choiceB: "安定した環境での着実な成果",
            type: "risk_vs_stability"
        },
        {
            id: 4,
            text: "得意なアプローチはどちらですか？",
            choiceA: "データや数字に基づいた分析",
            choiceB: "人の感情や文脈を読み解くこと",
            type: "data_vs_emotion"
        },
        {
            id: 5,
            text: "作業スタイルの好みは？",
            choiceA: "ひとりで集中して没頭したい",
            choiceB: "チームで議論しながら進めたい",
            type: "solo_vs_team"
        }
    ];

    export const results = {
        // Simple logic: Predominantly A (Creative/Leader/Risk) vs B (Steady/Support/Logic)
        // For a 5-question simple test, we can just count As.
        // 0-1 As: The Steadfast Supporter
        // 2 As: The Analytical Balancer
        // 3 As: The Creative Strategist
        // 4-5 As: The Visionary Pioneer

        type0: {
            title: "堅実なサポーター",
            desc: "あなたは組織の縁の下の力持ち。安定感と誠実さでチームを支えることが得意です。ルールを守り、着実に成果を積み上げる姿勢は周囲から厚く信頼されています。",
            job: "事務管理、バックオフィス、品質管理など",
            stats: [2, 4, 3, 5, 5] // 独創性, 論理性, 行動力, 協調性, 持続力
        },
        type1: {
            title: "分析的なバランサー",
            desc: "冷静な視点と協調性を兼ね備えています。データに基づいた判断ができつつ、周囲との調和も大切にするため、プロジェクトの調整役として活躍できます。",
            job: "データアナリスト、社内SE、経理など",
            stats: [3, 5, 3, 4, 4]
        },
        type2: {
            title: "独創的なストラテジスト",
            desc: "既存の枠にとらわれないアイデアを持っています。リスクを恐れずに挑戦する姿勢と、周囲を巻き込む力のバランスが良く、企画や戦略立案に向いています。",
            job: "マーケティング、企画職、コンサルタントなど",
            stats: [5, 4, 4, 3, 3]
        },
        type3: {
            title: "革新的なビジョナリー",
            desc: "圧倒的な行動力とビジョンを持つリーダータイプ。新しい道を切り拓くことに喜びを感じます。起業家精神が旺盛で、困難な状況すら楽しむ強さがあります。",
            job: "起業家、事業責任者、クリエイティブディレクターなど",
            stats: [5, 3, 5, 2, 4]
        }
    };
