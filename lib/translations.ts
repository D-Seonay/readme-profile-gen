export const translations = {
  en: {
    title: "Readme",
    subtitle: "Gen",
    tagline: "// Profile Configuration",
    resetBtn: "Reset All",
    resetConfirm: "Do you really want to reset all data?",
    themeLabel: "Theme",
    dark: "Dark",
    light: "Light",
    
    landing: {
      skip: "Skip to content",
      nav: {
        label: "Main",
        builder: "Open the builder",
        builderShort: "Builder",
        language: "Language",
        theme: "Theme",
        ink: "Ink",
        paper: "Paper",
        inkLabel: "Dark theme",
        paperLabel: "Light theme"
      },
      hero: {
        file: "you/you/README.md",
        titleLead: "Your GitHub profile",
        titleTail: "is a Markdown file.",
        lede: "Ultimate README Gen writes it for you. Fill in a few fields, pick badges, stats cards and sections, drag them into order, and watch the profile take shape as you type.",
        cta: "Open the builder",
        try: "Try it on this page",
        sticker: "Free, no sign-up",
        source: "README.md",
        proof: "On your profile",
        stamp: "Proof",
        caption: "Left, the Markdown the builder writes. Right, what GitHub shows on your profile."
      },
      samples: {
        role: "Type designer & front-end developer",
        bio: "I draw letters, then teach browsers how to set them.",
        work: "a variable font for code",
        learning: "Rust",
        fact: "I own more fonts than socks",
        skillsTitle: "🛠️ Tech Stack"
      },
      compose: {
        chapter: "Compose",
        title: "Type your name. *Watch the README write itself.*",
        lede: "This is the builder’s own engine, cut down to six fields. Every change rewrites the Markdown and the rendered profile together.",
        file: "compose.md",
        fields: {
          name: "name",
          role: "role",
          bio: "bio",
          stack: "stack",
          align: "align",
          badges: "badges",
          left: "left",
          center: "center"
        },
        views: {
          label: "Show",
          proof: "Rendered",
          markdown: "Markdown"
        },
        sourceLabel: "Generated Markdown",
        copy: "Copy Markdown",
        copied: "Markdown copied",
        copyError: "Couldn’t copy. Select the Markdown and copy it by hand.",
        continue: "Continue in the builder",
        continueNote: "Your six fields come with you. The builder has thirteen sections and free ones on top.",
        replaceTitle: "Replace your saved draft?",
        replaceBody: "The builder already holds a profile in progress. Continuing replaces its name, role, bio, stack, alignment and badge style.",
        replace: "Replace and continue",
        keep: "Keep my draft"
      },
      typeCase: {
        chapter: "Type case",
        title: "Every piece *a profile is made of.*",
        lede: "Thirteen ready-made sections, free sections for anything else, and badges in five styles. Use what you need, leave the rest empty.",
        anatomy: {
          title: "Anatomy of a badge",
          note: "Make your own for skills, socials or donations. This is the Markdown the builder writes for it.",
          sample: "Hire me",
          label: "label",
          labelNote: "any text",
          color: "colour",
          colorNote: "any hex value",
          logo: "logo",
          logoNote: "any Simple Icons name",
          style: "style",
          styleNote: "one of five",
          link: "link",
          linkNote: "optional URL or email"
        },
        styles: {
          title: "Five badge styles",
          note: "Real renders from shields.io. One switch restyles every badge in your README.",
          height: "px tall"
        },
        sections: {
          title: "Thirteen sections and a free one",
          note: "Listed in their default order. Drag them around in the builder; an empty section is left out.",
          free: "✏️ Free section",
          notes: {
            banner: "any image URL",
            typing: "animated lines of text",
            bio: "greeting, role, bio, free lines",
            skills: "48 technologies, plus your own badges",
            statstats: "needs a GitHub username",
            socials: "LinkedIn, X, portfolio, email, plus your own",
            stats: "needs a GitHub username",
            donations: "Buy Me a Coffee, Ko-fi, PayPal, plus your own",
            projects: "needs a GitHub username",
            wakatime: "needs a WakaTime username",
            spotify: "needs a Spotify widget link",
            rss: "needs a GitHub Action",
            followers: "needs a GitHub username",
            free: "Markdown or HTML, written as-is"
          }
        }
      },
      proofs: {
        chapter: "Proofs",
        title: "Three proofs, *pulled from the same press.*",
        lede: "Each one is the builder’s real output for the settings on its tag. The people are made up.",
        flip: "Show the Markdown",
        unflip: "Show the profile",
        sourceOf: "Markdown source of"
      },
      pressRun: {
        chapter: "Press run",
        title: "From an empty repo to your profile, *in three moves.*",
        repo: {
          title: "Create the repository",
          body: "Create a public repository named exactly like your GitHub username. Its README.md is shown at the top of your profile.",
          you: "you",
          owner: "Owner",
          name: "Repository name",
          special: "A repository named after you is special: its README.md appears on your profile.",
          visibility: "Public"
        },
        build: {
          title: "Fill the builder",
          body: "Start with your username: your name, bio, links and the stack already listed in your current profile are filled in. Then add sections and drag them into order.",
          username: "your-username",
          autofill: "Auto-Fill"
        },
        ship: {
          title: "Copy, commit, done",
          body: "Copy the Markdown or download README.md, then commit it to that repository. GitHub updates your profile as soon as it lands.",
          shortcut: "Ctrl or ⌘ + S downloads the file from the builder."
        }
      },
      closing: {
        title: "Your profile is *one commit away.*",
        cta: "Open the builder",
        note: "Free, no account. Your draft is saved in this browser."
      },
      footer: {
        signatureNote: "Every README made here can end with this line. It’s optional.",
        signature: "Generated with Ultimate GitHub Profile README Generator",
        colophonTitle: "Colophon",
        colophon: "Set in Instrument Serif, Geist and JetBrains Mono. Built with Next.js, React, Tailwind CSS, Zustand and react-markdown.",
        linksTitle: "Index",
        builder: "Builder",
        source: "Source on GitHub",
        bug: "Report a bug",
        author: "Made by Seonay",
        settingsTitle: "Settings",
        eof: "EOF"
      }
    },

    tour: {
      skip: "Skip",
      next: "Next",
      finish: "Finish",
      step1: "Magic Auto-fill: Start here by typing your GitHub username!",
      step2: "Visual Design: Customize alignment, colors, and badge styles.",
      step3: "Reorder Sections: Drag and drop to organize your README exactly how you want."
    },

    autofill: {
      label: "Smart Onboarding",
      title: "Magic: Pre-fill my profile",
      placeholder: "Your GitHub username...",
      button: "Auto-Fill",
      loading: "Searching...",
      help: "* Automatically fetches your name, bio, and public links.",
      errorNotFound: "User not found",
      errorGeneric: "Error fetching profile"
    },
    
    style: {
      label: "Design & Layout Customization",
      help: "// Customize global visual appearance",
      alignment: "Global Alignment",
      orientation: "Images Orientation",
      badgeStyle: "Badge Style",
      sectionTitles: "Custom Section Titles",
      left: "Left",
      center: "Center",
      vertical: "Vertical",
      horizontal: "Horizontal"
    },
    
    layout: {
      label: "Layout Manager",
      help: "// Reorder your README sections",
      banner: "🖼️ Header Banner",
      bio: "👤 Introduction / Bio",
      skills: "🛠️ Tech Stack & Skills",
      socials: "📫 Networks & Contact",
      stats: "📊 GitHub Stats",
      donations: "🎁 Support Me",
      projects: "🚀 Featured Projects",
      wakatime: "⏱️ WakaTime Activity",
      spotify: "🎵 Spotify Activity",
      rss: "📰 Latest Blog Posts",
      typing: "⌨️ Dynamic Typing Text",
      followers: "👥 Network & Followers",
      statstats: "⚡ Modern Stats (STAT-STATS)"
    },

    statstats: {
      label: "STAT-STATS Integration",
      help: "// Modern and customizable GitHub statistics cards",
      theme: "Card Theme",
      font: "Google Font",
      compact: "Compact Layout",
      hide: "Hide Statistics",
      cards: "Selected Cards",
      stats: "Overall Stats",
      topLangs: "Top Languages",
      streak: "GitHub Streak",
      topRepos: "Top Repositories",
      activity: "Recent Activity",
      trophies: "GitHub Trophies",
      org: "Organization Stats"
    },

    followers: {
      label: "Followers & Network",
      help: "// Show your GitHub community growth",
      showFollowers: "Show Followers",
      showFollowing: "Show Following",
      mode: "Display Style",
      badges: "Dynamic Badges",
      list: "Simple Links",
      grid: "Avatar Grid",
      limit: "Max Items"
    },

    typing: {
      label: "Typing SVG Integration",
      help: "// Add a dynamic animated text to your profile",
      placeholder: "Line 1\nLine 2\nLine 3...",
      textLabel: "Animated Text (One per line)",
      size: "Font Size",
      color: "Text Color (Hex)",
      duration: "Typing Speed (ms)",
      pause: "Pause between lines (ms)"
    },

    banner: {
      label: "Header Banner",
      help: "// Add a visual banner at the top of your profile",
      placeholder: "Image URL (ex: https://.../banner.png)"
    },

    spotify: {
      label: "Spotify Integration",
      help: "// Display what you're currently listening to (Requires novatorem/spotify-github-profile setup on GitHub)",
      placeholder: "Your Spotify Profile URL or Novatorem Link"
    },

    rss: {
      label: "Latest Blog Posts (RSS)",
      help: "// Automatically show your latest articles (Requires gautamkrishnar/blog-post-workflow GitHub Action)",
      placeholder: "RSS Feed URL (ex: https://medium.com/feed/@username)",
      actionHelp: "⚠️ Needs a GitHub Action to fetch dynamically. The placeholder will be generated."
    },
    
    github: {
      label: "GitHub Integration",
      help: "// Enter your username and choose a style",
      placeholder: "GitHub Username",
      theme: "Card Theme",
      trophies: "GitHub Trophies",
      stats: "Global Statistics",
      streak: "GitHub Streak",
      langs: "Top Languages",
      visitorCounter: "Visitor Counter",
      snake: "Snake Animation (Grid)"
    },

    wakatime: {
      label: "WakaTime Integration",
      help: "// Show your weekly coding activity",
      placeholder: "WakaTime Username",
      stats: "Coding Stats (Weekly)"
    },
    
    baseInfo: {
      label: "Base Information",
      name: "Full Name",
      job: "Job Title",
      bio: "Bio / Description",
      placeholderBio: "Tell us about yourself...",
      workingOn: "Currently working on",
      learning: "Learning about",
      collaboration: "Collaborating on",
      askMeAbout: "Ask me about",
      pronouns: "Pronouns",
      funFact: "Fun fact"
    },
    
    skills: {
      label: "Tech Stack & Skills",
      help: "// Select your technos by category",
      search: "Search a techno (ex: React, Docker...)",
      grouped: "Grouped",
      flat: "Flat"
    },
    
    socials: {
      label: "Social Networks & Contact",
      help: "// These links will be displayed in a new section",
      linkedin: "LinkedIn",
      twitter: "Twitter / X",
      portfolio: "Portfolio",
      email: "Email"
    },

    donations: {
      label: "Donations & Support",
      help: "// Show some love and support for your work",
      buymeacoffee: "Buy Me A Coffee",
      kofi: "Ko-fi",
      paypal: "PayPal"
    },

    free: {
      greeting: "Heading ({name} = your name)",
      titlePrefix: "Title emoji / prefix",
      lineLabel: "Line label",
      bioLines: "Free lines",
      addLine: "Add a free line",
      linePlaceholder: "🎮 Anything you want, Markdown allowed",
      customBadges: "Custom badges",
      addBadge: "Add a badge",
      quickAdd: "Quick add",
      badgeLabel: "Text",
      badgeUrl: "Link (URL or email)",
      badgeUrlOptional: "Link (optional)",
      badgeColor: "Color",
      badgeLogo: "Logo (simpleicons.org slug)",
      remove: "Remove",
      customSection: "Free section",
      untitled: "Untitled section",
      addSection: "Add a free section",
      sectionHelp: "// Free content: Markdown and HTML, written as-is",
      sectionTitle: "Section title (optional)",
      sectionContent: "Content (Markdown / HTML)",
      sectionPlaceholder: "Write anything: text, lists, tables, images, badges, HTML...",
      deleteSection: "Delete this section",
      credit: "Show the \"Generated with\" footer",
      export: "Export",
      import: "Import",
      exported: "Configuration exported",
      imported: "Configuration imported",
      importError: "Invalid configuration file"
    },

    projects: {
      label: "Featured Projects",
      help: "// Showcase your best repositories",
      placeholder: "Repo name (ex: my-awesome-app)",
      add: "Add Project",
      empty: "No projects added yet."
    },
    
    preview: {
      label: "Live Preview",
      raw: "Raw Code",
      copy: "Copy",
      copied: "Copied!",
      download: "Download",
      engine: "Live Rendering Engine",
      source: "Markdown Source View"
    }
  },
  fr: {
    title: "Readme",
    subtitle: "Gen",
    tagline: "// Configuration du profil",
    resetBtn: "Réinitialiser",
    resetConfirm: "Voulez-vous vraiment réinitialiser toutes les données ?",
    themeLabel: "Thème",
    dark: "Sombre",
    light: "Clair",

    landing: {
      skip: "Aller au contenu",
      nav: {
        label: "Principal",
        builder: "Ouvrir l’éditeur",
        builderShort: "Éditeur",
        language: "Langue",
        theme: "Thème",
        ink: "Encre",
        paper: "Papier",
        inkLabel: "Thème sombre",
        paperLabel: "Thème clair"
      },
      hero: {
        file: "pseudo/pseudo/README.md",
        titleLead: "Votre profil GitHub",
        titleTail: "est un fichier Markdown.",
        lede: "Ultimate README Gen l’écrit pour vous. Remplissez quelques champs, choisissez badges, cartes de stats et sections, glissez-les dans l’ordre voulu, et regardez le profil prendre forme à mesure que vous tapez.",
        cta: "Ouvrir l’éditeur",
        try: "L’essayer sur cette page",
        sticker: "Gratuit, sans inscription",
        source: "README.md",
        proof: "Sur votre profil",
        stamp: "Épreuve",
        caption: "À gauche, le Markdown écrit par l’éditeur. À droite, ce que GitHub affiche sur votre profil."
      },
      samples: {
        role: "Typographe & dev front-end",
        bio: "Je dessine des lettres, puis j’apprends aux navigateurs à les composer.",
        work: "une fonte variable pour le code",
        learning: "Rust",
        fact: "j’ai plus de polices que de chaussettes",
        skillsTitle: "🛠️ Stack technique"
      },
      compose: {
        chapter: "Composition",
        title: "Tapez votre nom. *Le README s’écrit tout seul.*",
        lede: "C’est le moteur de l’éditeur, réduit à six champs. Chaque modification réécrit à la fois le Markdown et le profil rendu.",
        file: "composition.md",
        fields: {
          name: "nom",
          role: "rôle",
          bio: "bio",
          stack: "stack",
          align: "alignement",
          badges: "badges",
          left: "gauche",
          center: "centré"
        },
        views: {
          label: "Afficher",
          proof: "Rendu",
          markdown: "Markdown"
        },
        sourceLabel: "Markdown généré",
        copy: "Copier le Markdown",
        copied: "Markdown copié",
        copyError: "Copie impossible. Sélectionnez le Markdown et copiez-le à la main.",
        continue: "Continuer dans l’éditeur",
        continueNote: "Vos six champs vous suivent. L’éditeur propose treize sections, plus des sections libres.",
        replaceTitle: "Remplacer votre brouillon ?",
        replaceBody: "L’éditeur contient déjà un profil en cours. Continuer remplace son nom, son rôle, sa bio, sa stack, son alignement et son style de badges.",
        replace: "Remplacer et continuer",
        keep: "Garder mon brouillon"
      },
      typeCase: {
        chapter: "Casse",
        title: "Toutes les pièces *qui composent un profil.*",
        lede: "Treize sections prêtes à l’emploi, des sections libres pour tout le reste, et des badges en cinq styles. Prenez ce qu’il vous faut, laissez le reste vide.",
        anatomy: {
          title: "Anatomie d’un badge",
          note: "Créez les vôtres pour vos compétences, vos réseaux ou vos dons. Voici le Markdown que l’éditeur écrit pour celui-ci.",
          sample: "Disponible",
          label: "libellé",
          labelNote: "n’importe quel texte",
          color: "couleur",
          colorNote: "n’importe quelle valeur hexa",
          logo: "logo",
          logoNote: "n’importe quel nom Simple Icons",
          style: "style",
          styleNote: "un parmi cinq",
          link: "lien",
          linkNote: "URL ou e-mail, facultatif"
        },
        styles: {
          title: "Cinq styles de badges",
          note: "Rendus réels de shields.io. Un seul réglage change tous les badges de votre README.",
          height: "px de haut"
        },
        sections: {
          title: "Treize sections et une libre",
          note: "Dans leur ordre par défaut. Réorganisez-les dans l’éditeur ; une section vide est ignorée.",
          free: "✏️ Section libre",
          notes: {
            banner: "n’importe quelle URL d’image",
            typing: "lignes de texte animées",
            bio: "accueil, rôle, bio, lignes libres",
            skills: "48 technologies, plus vos propres badges",
            statstats: "demande un pseudo GitHub",
            socials: "LinkedIn, X, portfolio, e-mail, plus les vôtres",
            stats: "demande un pseudo GitHub",
            donations: "Buy Me a Coffee, Ko-fi, PayPal, plus les vôtres",
            projects: "demande un pseudo GitHub",
            wakatime: "demande un pseudo WakaTime",
            spotify: "demande un lien de widget Spotify",
            rss: "demande une GitHub Action",
            followers: "demande un pseudo GitHub",
            free: "Markdown ou HTML, repris tel quel"
          }
        }
      },
      proofs: {
        chapter: "Épreuves",
        title: "Trois épreuves, *tirées de la même presse.*",
        lede: "Chacune est la sortie réelle de l’éditeur pour les réglages de son étiquette. Les personnes sont inventées.",
        flip: "Voir le Markdown",
        unflip: "Voir le profil",
        sourceOf: "Source Markdown de"
      },
      pressRun: {
        chapter: "Tirage",
        title: "D’un dépôt vide à votre profil, *en trois gestes.*",
        repo: {
          title: "Créez le dépôt",
          body: "Créez un dépôt public qui porte exactement votre pseudo GitHub. Son README.md s’affiche en haut de votre profil.",
          you: "pseudo",
          owner: "Propriétaire",
          name: "Nom du dépôt",
          special: "Un dépôt qui porte votre nom est spécial : son README.md apparaît sur votre profil.",
          visibility: "Public"
        },
        build: {
          title: "Remplissez l’éditeur",
          body: "Commencez par votre pseudo : nom, bio, liens et la stack déjà citée dans votre profil actuel sont préremplis. Ajoutez ensuite des sections et glissez-les dans l’ordre.",
          username: "votre-pseudo",
          autofill: "Auto-Fill"
        },
        ship: {
          title: "Copiez, committez, c’est en ligne",
          body: "Copiez le Markdown ou téléchargez README.md, puis committez-le dans ce dépôt. GitHub met votre profil à jour dès son arrivée.",
          shortcut: "Ctrl ou ⌘ + S télécharge le fichier depuis l’éditeur."
        }
      },
      closing: {
        title: "Votre profil n’est plus *qu’à un commit.*",
        cta: "Ouvrir l’éditeur",
        note: "Gratuit, sans compte. Votre brouillon est enregistré dans ce navigateur."
      },
      footer: {
        signatureNote: "Chaque README créé ici peut se terminer par cette ligne. Elle est facultative.",
        signature: "Généré avec Ultimate GitHub Profile README Generator",
        colophonTitle: "Colophon",
        colophon: "Composé en Instrument Serif, Geist et JetBrains Mono. Construit avec Next.js, React, Tailwind CSS, Zustand et react-markdown.",
        linksTitle: "Index",
        builder: "Éditeur",
        source: "Code source sur GitHub",
        bug: "Signaler un bug",
        author: "Fait par Seonay",
        settingsTitle: "Réglages",
        eof: "EOF"
      }
    },

    tour: {
      skip: "Passer",
      next: "Suivant",
      finish: "Terminer",
      step1: "Remplissage Magique : Commencez ici en entrant votre pseudo GitHub !",
      step2: "Design Visuel : Personnalisez l'alignement, les couleurs et le style des badges.",
      step3: "Ordre des Sections : Glissez-déposez pour organiser votre README comme vous le souhaitez."
    },
    
    autofill: {
      label: "Onboarding Intelligent",
      title: "Magie : Pré-remplir mon profil",
      placeholder: "Ton pseudo GitHub...",
      button: "Auto-Fill",
      loading: "Recherche...",
      help: "* Récupère automatiquement ton nom, ta bio et tes liens publics.",
      errorNotFound: "Utilisateur non trouvé",
      errorGeneric: "Erreur lors de la récupération"
    },
    
    style: {
      label: "Personnalisation du Design",
      help: "// Personnalisez l'apparence visuelle globale",
      alignment: "Alignement Global",
      orientation: "Orientation des Images",
      badgeStyle: "Style des Badges",
      sectionTitles: "Titres des Sections",
      left: "Gauche",
      center: "Centré",
      vertical: "Vertical",
      horizontal: "Horizontal"
    },
    
    layout: {
      label: "Gestion du Layout",
      help: "// Réorganisez l'ordre de votre README",
      banner: "🖼️ Bannière d'en-tête",
      bio: "👤 Introduction / Bio",
      skills: "🛠️ Tech Stack & Compétences",
      socials: "📫 Réseaux & Contact",
      stats: "📊 Stats GitHub",
      donations: "🎁 Me soutenir",
      projects: "🚀 Projets Phares",
      wakatime: "⏱️ Activité WakaTime",
      spotify: "🎵 Musique Spotify",
      rss: "📰 Derniers Articles",
      typing: "⌨️ Texte Animé (Typing)",
      followers: "👥 Réseau & Followers",
      statstats: "⚡ Stats Modernes (STAT-STATS)"
    },

    statstats: {
      label: "Intégration STAT-STATS",
      help: "// Cartes de statistiques GitHub modernes et personnalisables",
      theme: "Thème de la carte",
      font: "Police Google Font",
      compact: "Mise en page compacte",
      hide: "Masquer des statistiques",
      cards: "Cartes sélectionnées",
      stats: "Stats Globales",
      topLangs: "Top Langages",
      streak: "Séquence (Streak)",
      topRepos: "Meilleurs Dépôts",
      activity: "Activité Récente",
      trophies: "Trophées GitHub",
      org: "Stats d'Organisation"
    },

    followers: {
      label: "Followers & Réseau",
      help: "// Affichez la croissance de votre communauté",
      showFollowers: "Afficher Followers",
      showFollowing: "Afficher Following",
      mode: "Style d'affichage",
      badges: "Badges Dynamiques",
      list: "Liens Simples",
      grid: "Grille d'Avatars",
      limit: "Nombre maximum"
    },

    typing: {
      label: "Intégration Typing SVG",
      help: "// Ajoutez un texte animé dynamique à votre profil",
      placeholder: "Ligne 1\nLigne 2\nLigne 3...",
      textLabel: "Texte à animer (Une phrase par ligne)",
      size: "Taille de la police",
      color: "Couleur (Hex)",
      duration: "Vitesse de frappe (ms)",
      pause: "Pause entre lignes (ms)"
    },

    banner: {
      label: "Bannière d'en-tête",
      help: "// Ajoutez une image forte au sommet de votre profil",
      placeholder: "URL de l'image (ex: https://.../banner.png)"
    },

    spotify: {
      label: "Intégration Spotify",
      help: "// Affiche votre écoute en cours (Requiert le service novatorem/spotify-github-profile sur votre compte)",
      placeholder: "Lien de base Spotify Novatorem (ex: https://spotify-github-profile.vercel.app/api/view?uid=...)"
    },

    rss: {
      label: "Derniers Articles (RSS)",
      help: "// Affiche vos articles (Requiert la GitHub Action gautamkrishnar/blog-post-workflow)",
      placeholder: "URL de votre flux RSS (ex: https://medium.com/feed/@username)",
      actionHelp: "⚠️ Nécessite une GitHub Action pour la mise à jour dynamique. Le code généré inclura les balises nécessaires."
    },
    
    github: {
      label: "Intégration GitHub",
      help: "// Entrez votre pseudo et choisissez un style",
      placeholder: "Pseudo GitHub",
      theme: "Thème des cartes",
      trophies: "Trophées GitHub",
      stats: "Statistiques Globales",
      streak: "Séquence (Streak) GitHub",
      langs: "Top Langages",
      visitorCounter: "Compteur de Visites",
      snake: "Animation Serpent (Grille)"
    },

    wakatime: {
      label: "Intégration WakaTime",
      help: "// Affiche ton activité de code hebdomadaire",
      placeholder: "Pseudo WakaTime",
      stats: "Stats de Code (Semaine)"
    },
    
    baseInfo: {
      label: "Informations de Base",
      name: "Nom Complet",
      job: "Poste / Titre",
      bio: "Bio / Description",
      placeholderBio: "Parlez de vous...",
      workingOn: "Travaille actuellement sur",
      learning: "Apprend",
      collaboration: "Collabore sur",
      askMeAbout: "Questions sur",
      pronouns: "Pronoms",
      funFact: "Anecdote"
    },
    
    skills: {
      label: "Stack Technique",
      help: "// Sélectionnez vos technos par catégorie",
      search: "Rechercher une techno (ex: React, Docker...)",
      grouped: "Groupé",
      flat: "Liste"
    },
    
    socials: {
      label: "Réseaux Sociaux & Contact",
      help: "// Ces liens seront affichés in a new section",
      linkedin: "LinkedIn",
      twitter: "Twitter / X",
      portfolio: "Portfolio",
      email: "Email"
    },

    donations: {
      label: "Dons & Soutien",
      help: "// Permettez aux gens de soutenir votre travail",
      buymeacoffee: "Buy Me A Coffee",
      kofi: "Ko-fi",
      paypal: "PayPal"
    },

    free: {
      greeting: "Titre d'accueil ({name} = votre nom)",
      titlePrefix: "Emoji / préfixe du titre",
      lineLabel: "Libellé de la ligne",
      bioLines: "Lignes libres",
      addLine: "Ajouter une ligne libre",
      linePlaceholder: "🎮 Ce que vous voulez, Markdown accepté",
      customBadges: "Badges personnalisés",
      addBadge: "Ajouter un badge",
      quickAdd: "Ajout rapide",
      badgeLabel: "Texte",
      badgeUrl: "Lien (URL ou email)",
      badgeUrlOptional: "Lien (optionnel)",
      badgeColor: "Couleur",
      badgeLogo: "Logo (slug simpleicons.org)",
      remove: "Supprimer",
      customSection: "Section libre",
      untitled: "Section sans titre",
      addSection: "Ajouter une section libre",
      sectionHelp: "// Contenu libre : Markdown et HTML, repris tel quel",
      sectionTitle: "Titre de la section (optionnel)",
      sectionContent: "Contenu (Markdown / HTML)",
      sectionPlaceholder: "Écrivez ce que vous voulez : texte, listes, tableaux, images, badges, HTML...",
      deleteSection: "Supprimer cette section",
      credit: "Afficher le pied de page « Généré avec »",
      export: "Exporter",
      import: "Importer",
      exported: "Configuration exportée",
      imported: "Configuration importée",
      importError: "Fichier de configuration invalide"
    },

    projects: {
      label: "Projets Phares",
      help: "// Mettez en avant vos meilleurs dépôts",
      placeholder: "Nom du dépôt (ex: mon-super-projet)",
      add: "Ajouter",
      empty: "Aucun projet ajouté."
    },
    
    preview: {
      label: "Prévisualisation",
      raw: "Code Brut",
      copy: "Copier",
      copied: "Copié !",
      download: "Télécharger",
      engine: "Moteur de rendu temps réel",
      source: "Vue Source Markdown"
    }
  }
};
