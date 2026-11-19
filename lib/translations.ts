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
      hero: {
        tagline: "The Ultimate GitHub Profile README Generator",
        subtitle: "Design a professional profile in seconds with smart automation, interactive layouts, and beautiful stats cards.",
        cta: "Start Building Now"
      },
      features: {
        autofill: { title: "Smart Auto-fill", desc: "Fetch your GitHub data instantly." },
        dragdrop: { title: "Drag & Drop", desc: "Reorder your profile sections easily." },
        livepreview: { title: "Live Preview", desc: "See your changes in real-time as you build." }
      },
      howItWorks: {
        step1: { title: "1. Enter Username", desc: "Type your GitHub handle." },
        step2: { title: "2. Customize", desc: "Pick your tech stack and layout." },
        step3: { title: "3. Export", desc: "Copy the code to your profile." }
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
    },

    // Builder workspace (Atelier redesign)
    builder: {
      skip: "Skip to the editor",
      help: {
        bio: "Your name, your title, a short bio and a few quick facts."
      },
      toolbar: {
        home: "Readme Gen home page",
        outline: "Sections",
        search: "Jump to…",
        searchLabel: "Search sections and commands",
        more: "More",
        copy: "Copy Markdown",
        copied: "Copied",
        download: "Download",
        downloadLabel: "Download README.md",
        themeToLight: "Switch to light theme",
        themeToDark: "Switch to dark theme",
        language: "Language"
      },
      meter: {
        label: "{live} of {total} sections are in your README",
        caption: "live",
        live: "in README",
        empty: "empty"
      },
      outline: {
        title: "README outline",
        liveShort: "live",
        setup: "Setup",
        sections: "Sections",
        start: "Start",
        style: "Style",
        templates: "Templates",
        tools: "Checks & tools",
        toolsHelp: "Score your README, export the GitHub Actions it needs, and bring in an existing one.",
        dragHint: "drag to reorder",
        addFree: "Add a free section",
        reorder: "Reorder {label}",
        live: "in README",
        empty: "empty",
        close: "Close the outline",
        credit: "Made by Seonay",
        bug: "Report a bug",
        instructions: "To reorder, press space or enter on a handle, move it with the arrow keys, then press space or enter again to drop it, or escape to cancel.",
        announce: {
          start: "Picked up {label}.",
          over: "{label} is over {over}.",
          end: "{label} dropped over {over}.",
          endNoTarget: "{label} dropped.",
          cancel: "Moving {label} was cancelled."
        }
      },
      plate: {
        of: "of",
        setup: "Setup",
        live: "In README",
        empty: "Not in README yet",
        emptyHint: "Fill in a field below and this section joins your README.",
        heading: "Heading in README",
        headingHint: "Leave it empty to show the section without a heading.",
        previous: "Previous",
        next: "Next",
        pager: "Sections"
      },
      start: {
        title: "Start from your GitHub profile",
        help: "Type your GitHub username and we fill in what we can find: your name, bio, links and the skills mentioned in your current profile README.",
        fieldLabel: "GitHub username",
        fetch: "Fill from GitHub",
        success: "Profile filled from GitHub",
        continue: "Continue to Introduction",
        elsewhere: "Or start another way",
        writeIntro: "Write your introduction",
        importConfig: "Import a saved config",
        paletteTip: "jumps to any section or command, from anywhere.",
        checklist: [
          "Your name and bio",
          "Website, X / Twitter, LinkedIn and email",
          "Skills mentioned in your current README",
          "Nothing you have already written is overwritten"
        ],
        receipt: {
          title: "Filled from @{user}",
          name: "name",
          bio: "bio",
          links: "links",
          skills: "skills",
          filled: "filled",
          added: "{n} added",
          detected: "{n} detected",
          legend: "— means unchanged: already filled in, or not found on GitHub."
        }
      },
      style: {
        help: "Choices that apply to every section: alignment, badges, headings.",
        layout: "Layout",
        badgeHint: "Applies to every badge: skills, networks, support and custom badges.",
        footer: "Footer",
        headingsHint: "Every section heading in one place. Each one can also be edited at the top of its section."
      },
      preview: {
        title: "Preview",
        rendered: "Rendered",
        markdown: "Markdown",
        ghTheme: "GitHub theme",
        ghLight: "GitHub light",
        ghDark: "GitHub dark",
        collapse: "Hide the preview",
        expand: "Show the preview",
        resize: "Resize the preview",
        edit: "Edit {label}",
        emptyTitle: "Nothing to preview yet.",
        emptyBody: "Fill in a section and it shows up here as you type.",
        lines: "{n} lines",
        chars: "{n} characters",
        downloaded: "README.md downloaded",
        copyError: "Copy failed: the browser blocked clipboard access.",
        downloadError: "README.md could not be created.",
        yourName: "username",
        source: "Markdown source"
      },
      mobile: {
        edit: "Edit",
        preview: "Preview",
        view: "View"
      },
      palette: {
        label: "Command palette",
        placeholder: "Type a section or a command…",
        empty: "Nothing matches “{q}”.",
        jump: "Go to",
        actions: "Actions",
        view: "View",
        help: "Help",
        newSection: "New free section",
        autofill: "Fill from GitHub",
        exportConfig: "Export config (.json)",
        importConfig: "Import config…",
        reset: "Reset everything…",
        switchLanguage: "Passer en français",
        ghTheme: "Toggle the GitHub preview theme",
        viewRaw: "Show the Markdown source",
        viewRendered: "Show the rendered preview",
        tour: "Replay the tour",
        bug: "Report a bug or an idea",
        navigate: "move",
        run: "run",
        close: "close"
      },
      tour: {
        progress: "Step {n} of {total}",
        back: "Back",
        steps: {
          autofill: {
            title: "Start from GitHub",
            body: "Type your username and we fill in what GitHub knows. You can also skip this and write everything yourself."
          },
          outline: {
            title: "Your README, in order",
            body: "Every section, in the order it will appear. Drag a handle to move one; a lime dot means it is live.",
            bodyCompact: "Your sections live behind this button: open it to jump between them or drag them into a new order."
          },
          plate: {
            title: "One section at a time",
            body: "Each section has its own page. Fill in a field and the section joins your README."
          },
          preview: {
            title: "Proofread it like GitHub",
            body: "The preview uses GitHub's own styles. Switch GitHub light or dark, read the raw Markdown, or click a block to edit it."
          },
          export: {
            title: "Ship it",
            body: "Copy the Markdown or download README.md, then commit it to your username/username repository. Ctrl+K (⌘K on a Mac) opens every command."
          }
        }
      },
      confirm: {
        cancel: "Cancel"
      },
      reset: {
        done: "Everything was reset",
        undo: "Undo",
        restored: "Your README is back"
      },
      banner: {
        urlLabel: "Image URL",
        loadError: "This image could not be loaded. Check that the URL points to an image.",
        previewAlt: "Banner preview"
      },
      typing: {
        colorHint: "Leave empty for the default, F1F1F1.",
        pickColor: "Pick a color",
        previewAlt: "Preview of the typing animation"
      },
      bio: {
        identity: "Identity",
        facts: "Quick facts",
        factsHint: "Each filled fact becomes a bullet. The italic label before it can be edited too.",
        factLabel: "Label for “{field}”",
        freeLinesHint: "Extra bullets, written exactly as you type them. Markdown works.",
        placeholders: {
          name: "Ada Lovelace",
          title: "Fullstack developer",
          currentWork: "Project name or URL",
          learning: "A language, a framework…",
          collaboration: "Open source projects…",
          askMeAbout: "Topics you know well",
          pronouns: "she/her, he/him, they/them…",
          funFact: "I love pizza…"
        }
      },
      badges: {
        hint: "Anything shields.io can draw: a text, a color, an optional logo and link.",
        hintWithLink: "Anything shields.io can draw. A badge needs a text and a link to appear.",
        incomplete: "Add a text to show this badge.",
        incompleteWithLink: "Add a text and a link to show this badge."
      },
      skills: {
        library: "Library",
        viewLabel: "Display",
        searchLabel: "Search",
        selected: "{n} selected",
        remove: "Remove {label}",
        noResults: "No technology matches “{q}”."
      },
      github: {
        setUsername: "Set your GitHub username",
        online: "online",
        offline: "offline",
        checking: "checking",
        usernameHint: "Used by every card, and by the Projects, Network and Modern Stats sections.",
        cards: "Cards",
        serviceOffline: "This service is offline right now.",
        themeHint: "Applies to the stats, languages, streak, trophies and project cards."
      },
      statstats: {
        needsUser: "These cards need your GitHub username.",
        pick: "Cards to show",
        look: "Look",
        previews: "Card previews",
        sampleNote: "Previews use a sample profile until your username is set."
      },
      wakatime: {
        usernameLabel: "WakaTime username (for the graph)",
        badgeId: "Badge ID (UUID)",
        badgeHelp: "Find it in your WakaTime settings, under “Embeddable badges”.",
        offline: "WakaTime is unreachable right now: the graph may not load."
      },
      socials: {
        profiles: "Profiles",
        placeholders: {
          linkedin: "username or profile URL",
          twitter: "@username",
          portfolio: "https://…",
          email: "you@example.com"
        }
      },
      donations: {
        platforms: "Platforms",
        placeholder: "username"
      },
      projects: {
        needsUser: "Pinned projects need your GitHub username.",
        repoLabel: "Repository name",
        exists: "This repository is already pinned.",
        emptyBody: "Add a repository name and it appears as a card.",
        remove: "Remove {repo}"
      },
      followers: {
        needsUser: "Followers need your GitHub username.",
        limitHint: "How many avatars to fetch for the grid."
      },
      spotify: {
        urlLabel: "Spotify card URL"
      },
      rss: {
        urlLabel: "Feed URL"
      },
      custom: {
        deleted: "Section deleted",
        undo: "Undo"
      }
    },

    // --- Extended README engine (templates, new sections, workflows, health, sharing) ---
    engine: {
      common: {
        add: "Add",
        remove: "Remove",
        moveUp: "Move up",
        moveDown: "Move down",
        enable: "Enabled",
        copy: "Copy",
        copied: "Copied",
        download: "Download",
        apply: "Apply",
        cancel: "Cancel",
        loading: "Loading…",
        sectionTitle: "Section title",
        sectionTitleHelp: "Empty = no heading",
        theme: "Theme",
        style: "Layout",
        none: "None",
        needsUsername: "Needs your GitHub username (Stats section or auto-fill).",
        previewAlt: "Live preview"
      },
      sections: {
        headerBanner: "🌊 Animated Header",
        footerBanner: "🌊 Animated Footer",
        activity: "📈 Activity Graph",
        summaryCards: "🧾 Profile Summary Cards",
        quote: "💬 Quote / Joke Card",
        experience: "💼 Experience / Timeline",
        currently: "⚡ Currently",
        pinned: "📌 Pinned Repos & Gists"
      },
      help: {
        headerBanner: "// A capsule-render banner opening your profile",
        footerBanner: "// A capsule-render wave closing your profile",
        activity: "// Your contribution curve over the last days",
        summaryCards: "// Profile, languages, stats and productive hours",
        quote: "// A fresh dev quote or programming joke on every visit",
        experience: "// Roles, organisations and dates as a table or a list",
        currently: "// What you are working on, reading, listening to…",
        pinned: "// Repos from any account and gists, with your own words"
      },
      capsule: {
        enable: "Show this banner",
        type: "Shape",
        colorMode: "Colours",
        colorModes: {
          gradient: "Random gradient",
          auto: "Random colour",
          timeGradient: "Gradient of the day",
          timeAuto: "Colour of the day",
          random: "Surprise me",
          solid: "Solid colour",
          customGradient: "Custom gradient"
        },
        color: "Colour",
        color2: "Gradient end",
        height: "Height (px)",
        text: "Text",
        textHelp: "{name} = your name · {title} = your job title · new line = line break",
        desc: "Subtitle",
        fontColor: "Text colour",
        fontColorHelp: "Empty = automatic",
        fontSize: "Text size",
        fontAlignY: "Text vertical position (%)",
        descSize: "Subtitle size",
        descAlignY: "Subtitle vertical position (%)",
        animation: "Text animation",
        animations: {
          none: "None",
          fadeIn: "Fade in",
          scaleIn: "Scale in",
          blink: "Blink",
          blinking: "Blinking",
          twinkling: "Twinkling"
        },
        reversal: "Mirror the shape",
        textBg: "Highlight the text"
      },
      activity: {
        enable: "Show the activity graph",
        days: "Days shown",
        height: "Height (px)",
        radius: "Corner radius",
        area: "Fill the area under the curve",
        hideBorder: "Hide the border",
        hideTitle: "Hide the title",
        customTitle: "Custom title",
        customTitleHelp: "Empty = default title"
      },
      summary: {
        cards: "Cards",
        kinds: {
          "profile-details": "Profile details",
          "repos-per-language": "Languages by repo",
          "most-commit-language": "Languages by commit",
          stats: "Stats",
          "productive-time": "Productive time"
        },
        animation: "Entrance animation",
        source: "Rendering",
        sources: {
          hosted: "Public API",
          action: "GitHub Action (no rate limit)"
        },
        sourceActionHelp: "The cards are generated daily in your profile repository by a workflow (see Workflows). They include all your repositories.",
        timeZone: "Time zone (productive time)",
        timeZoneHelp: "IANA name, e.g. Europe/Paris — empty = UTC",
        exclude: "Languages to hide",
        excludeHelp: "Comma-separated, e.g. HTML,Jupyter Notebook"
      },
      quote: {
        enable: "Show the card",
        kind: "Card",
        kinds: {
          quote: "Dev quote",
          joke: "Programming joke"
        },
        layout: "Layout",
        font: "Font",
        animation: "Animation",
        category: "Category",
        anyCategory: "Any",
        hideBorder: "Hide the border"
      },
      experience: {
        add: "Add a position",
        role: "Role",
        org: "Organisation",
        link: "Link (optional)",
        start: "Start",
        end: "End",
        endHelp: "Empty = present",
        description: "Description (optional)",
        styles: {
          table: "Table",
          list: "List"
        },
        empty: "No position yet."
      },
      currently: {
        add: "Add a line",
        kind: "Type",
        kinds: {
          working: "Working on",
          learning: "Learning",
          reading: "Reading",
          listening: "Listening to",
          watching: "Watching",
          playing: "Playing",
          building: "Building",
          writing: "Writing",
          custom: "Custom"
        },
        label: "Label",
        labelHelp: "Empty = default label in the README language",
        value: "Value",
        link: "Link (optional)",
        styles: {
          table: "Table",
          list: "List"
        },
        empty: "Nothing yet."
      },
      pinned: {
        addRepo: "Pin a repository",
        addGist: "Pin a gist",
        kinds: {
          repo: "Repository",
          gist: "Gist"
        },
        owner: "Owner",
        ownerHelp: "Empty = your GitHub username",
        repoName: "Repository name",
        gistId: "Gist id",
        description: "Your description",
        styles: {
          cards: "Cards",
          grid: "Grid",
          list: "Text list"
        },
        stylesHelp: "The text list needs no image service: it always renders.",
        empty: "Nothing pinned yet."
      },
      skillIcons: {
        display: "Display",
        displays: {
          badges: "Badges",
          icons: "Icon grid"
        },
        perLine: "Icons per row",
        theme: "Icon background",
        themes: {
          dark: "Dark",
          light: "Light",
          auto: "Follow GitHub theme"
        },
        missing: "{count} skill(s) have no skillicons.dev icon and stay as badges: {names}."
      },
      stats: {
        provider: "Stats card host",
        providers: {
          "github-readme-stats": "github-readme-stats (original)",
          "github-stats-extended": "GitHub Stats Extended (maintained)"
        },
        providerHelp: "github-readme-stats is no longer maintained; GitHub Stats Extended is a drop-in successor."
      },
      waka: {
        readme: "Daily WakaTime stats block (GitHub Action)",
        readmeHelp: "Adds the markers filled every day by athul/waka-readme. Set it up in Workflows.",
        badgesNote: "The coding-time badges read your public WakaTime stats: enable “Display code time publicly” and “Display languages publicly” on WakaTime. No API key is ever put in your README."
      },
      rss: {
        maxPosts: "Posts shown",
        feedsHelp: "Several feeds? Separate the URLs with commas. The workflow is generated in Workflows."
      },
      templates: {
        label: "Templates",
        help: "// Start from a complete, opinionated layout — your data stays",
        apply: "Use this template",
        applied: "Template applied",
        undo: "Undo",
        keepsIdentity: "Applying a template changes the layout and style only: your name, links, skills and texts are kept. Undo anytime (Ctrl/⌘ + Z)."
      },
      history: {
        undo: "Undo",
        redo: "Redo",
        undoShortcut: "Undo (Ctrl/⌘ + Z)",
        redoShortcut: "Redo (Ctrl/⌘ + Shift + Z)"
      },
      share: {
        button: "Share link",
        copied: "Link copied — it contains your whole setup",
        tooLong: "The link is very long ({length} characters): some apps may cut it.",
        failed: "Could not create the link",
        loadTitle: "Load the shared profile?",
        loadDescription: "This link contains a profile setup. Loading it replaces your current work (you can undo it right after).",
        loadConfirm: "Load it",
        loadCancel: "Keep mine",
        loaded: "Shared profile loaded",
        invalid: "This share link is invalid or damaged"
      },
      workflows: {
        label: "Workflows (GitHub Actions)",
        help: "// The automations some sections need in your profile repository",
        none: "No enabled section needs a workflow. The snake, blog posts, the WakaTime block and Action-rendered summary cards do.",
        secrets: "Secrets to create",
        noSecret: "No secret needed: the built-in GITHUB_TOKEN is used.",
        steps: "Setup",
        copy: "Copy the YAML",
        download: "Download",
        checkRepo: "Check my profile repository",
        installed: "Installed",
        missing: "Not found",
        rateLimited: "GitHub API rate limit reached, try again later.",
        noUsername: "Enter your GitHub username to check your repository."
      },
      health: {
        label: "README Health Check",
        help: "// Score and fixes before you publish",
        score: "Score",
        noFindings: "Nothing to report: this README is ready to ship.",
        fix: "Fix",
        fixed: "Fixed",
        recheck: "Re-check services",
        checkWorkflows: "Verify workflows",
        severity: {
          error: "Error",
          warning: "Warning",
          info: "Tip"
        },
        stats: "{sections} sections · {images} images · {badges} badges · {characters} characters"
      },
      importer: {
        label: "Import an existing README",
        help: "// Bring your current profile in instead of starting over",
        username: "GitHub username",
        fetch: "Fetch README",
        fetching: "Fetching…",
        notFound: "No README found in {repo}.",
        rateLimited: "GitHub API rate limit reached, try again in a few minutes.",
        error: "Could not fetch the README.",
        blocks: "Content blocks",
        blocksHelp: "Your own content is pre-selected; widgets the builder can recreate are not.",
        kinds: {
          custom: "Your content",
          generated: "Widgets",
          dynamic: "Auto-updated",
          empty: "Empty"
        },
        intro: "Introduction (before the first heading)",
        importSelected: "Import {count} block(s) as free sections",
        imported: "{count} free section(s) added",
        suggestions: "Settings detected",
        suggestionsHelp: "Turn on the matching builder features.",
        applySuggestions: "Apply {count} setting(s)",
        applied: "Settings applied",
        selectAll: "All",
        selectNone: "None",
        suggestionKinds: {
          statsCard: "Stats card",
          topLanguages: "Top languages",
          streak: "Streak card",
          trophies: "Trophies",
          visitors: "Visitor counter",
          snake: "Contribution snake",
          headerBanner: "Animated header",
          footerBanner: "Animated footer",
          typing: "Typing text",
          skillIcons: "Skill icons",
          activity: "Activity graph",
          summaryCards: "Summary card",
          quote: "Quote card",
          joke: "Joke card",
          pinnedRepo: "Pinned repository",
          pinnedGist: "Pinned gist",
          wakaReadme: "WakaTime block",
          wakatimeBadge: "WakaTime badge",
          spotify: "Spotify card",
          skills: "Skills",
          statsProvider: "GitHub Stats Extended"
        }
      }
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
      hero: {
        tagline: "Le Générateur de README GitHub Ultime",
        subtitle: "Concevez un profil professionnel en quelques secondes avec une automatisation intelligente et des cartes de stats magnifiques.",
        cta: "Commencer maintenant"
      },
      features: {
        autofill: { title: "Remplissage Magique", desc: "Récupérez vos données GitHub instantanément." },
        dragdrop: { title: "Glisser-Déposer", desc: "Réorganisez les sections de votre profil facilement." },
        livepreview: { title: "Prévisualisation Live", desc: "Voyez vos changements en temps réel pendant que vous construisez." }
      },
      howItWorks: {
        step1: { title: "1. Pseudo", desc: "Entrez votre nom d'utilisateur GitHub." },
        step2: { title: "2. Personnalisez", desc: "Choisissez votre stack et votre layout." },
        step3: { title: "3. Exportez", desc: "Copiez le code sur votre profil." }
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
    },

    // Builder workspace (Atelier redesign)
    builder: {
      skip: "Aller à l’éditeur",
      help: {
        bio: "Votre nom, votre titre, une courte bio et quelques infos en bref."
      },
      toolbar: {
        home: "Accueil de Readme Gen",
        outline: "Sections",
        search: "Aller à…",
        searchLabel: "Rechercher une section ou une commande",
        more: "Plus",
        copy: "Copier le Markdown",
        copied: "Copié",
        download: "Télécharger",
        downloadLabel: "Télécharger README.md",
        themeToLight: "Passer au thème clair",
        themeToDark: "Passer au thème sombre",
        language: "Langue"
      },
      meter: {
        label: "{live} sections sur {total} sont dans votre README",
        caption: "actives",
        live: "dans le README",
        empty: "vide"
      },
      outline: {
        title: "Plan du README",
        liveShort: "actives",
        setup: "Préparation",
        sections: "Sections",
        start: "Départ",
        style: "Style",
        templates: "Modèles",
        tools: "Contrôles & outils",
        toolsHelp: "Notez votre README, exportez les GitHub Actions nécessaires et importez un README existant.",
        dragHint: "glisser pour réordonner",
        addFree: "Ajouter une section libre",
        reorder: "Déplacer {label}",
        live: "dans le README",
        empty: "vide",
        close: "Fermer le plan",
        credit: "Fait par Seonay",
        bug: "Signaler un bug",
        instructions: "Pour réordonner, appuyez sur espace ou entrée sur une poignée, déplacez-la avec les flèches, puis appuyez de nouveau sur espace ou entrée pour la déposer, ou sur échap pour annuler.",
        announce: {
          start: "{label} saisie.",
          over: "{label} est au-dessus de {over}.",
          end: "{label} déposée sur {over}.",
          endNoTarget: "{label} déposée.",
          cancel: "Déplacement de {label} annulé."
        }
      },
      plate: {
        of: "sur",
        setup: "Préparation",
        live: "Dans le README",
        empty: "Pas encore dans le README",
        emptyHint: "Remplissez un champ ci-dessous et cette section rejoint votre README.",
        heading: "Titre dans le README",
        headingHint: "Laissez vide pour afficher la section sans titre.",
        previous: "Précédente",
        next: "Suivante",
        pager: "Sections"
      },
      start: {
        title: "Partir de votre profil GitHub",
        help: "Entrez votre pseudo GitHub et on remplit ce qu’on trouve : votre nom, votre bio, vos liens et les compétences citées dans votre README de profil actuel.",
        fieldLabel: "Pseudo GitHub",
        fetch: "Remplir depuis GitHub",
        success: "Profil rempli depuis GitHub",
        continue: "Continuer vers l’introduction",
        elsewhere: "Ou commencer autrement",
        writeIntro: "Écrire votre introduction",
        importConfig: "Importer une configuration",
        paletteTip: "ouvre n’importe quelle section ou commande, où que vous soyez.",
        checklist: [
          "Votre nom et votre bio",
          "Site, X / Twitter, LinkedIn et e-mail",
          "Les compétences citées dans votre README actuel",
          "Rien de ce que vous avez déjà écrit n’est remplacé"
        ],
        receipt: {
          title: "Rempli depuis @{user}",
          name: "nom",
          bio: "bio",
          links: "liens",
          skills: "compétences",
          filled: "remplie",
          added: "{n} ajouté(s)",
          detected: "{n} détectée(s)",
          legend: "— signifie inchangé : déjà rempli, ou introuvable sur GitHub."
        }
      },
      style: {
        help: "Les réglages communs à toutes les sections : alignement, badges, titres.",
        layout: "Mise en page",
        badgeHint: "S’applique à tous les badges : compétences, réseaux, soutien et badges personnalisés.",
        footer: "Pied de page",
        headingsHint: "Tous les titres de section au même endroit. Chacun se modifie aussi en haut de sa section."
      },
      preview: {
        title: "Aperçu",
        rendered: "Rendu",
        markdown: "Markdown",
        ghTheme: "Thème GitHub",
        ghLight: "GitHub clair",
        ghDark: "GitHub sombre",
        collapse: "Masquer l’aperçu",
        expand: "Afficher l’aperçu",
        resize: "Redimensionner l’aperçu",
        edit: "Modifier {label}",
        emptyTitle: "Rien à afficher pour l’instant.",
        emptyBody: "Remplissez une section : elle apparaît ici au fil de la frappe.",
        lines: "{n} lignes",
        chars: "{n} caractères",
        downloaded: "README.md téléchargé",
        copyError: "Échec de la copie : le navigateur a bloqué l’accès au presse-papiers.",
        downloadError: "Impossible de créer README.md.",
        yourName: "pseudo",
        source: "Source Markdown"
      },
      mobile: {
        edit: "Éditer",
        preview: "Aperçu",
        view: "Vue"
      },
      palette: {
        label: "Palette de commandes",
        placeholder: "Tapez une section ou une commande…",
        empty: "Rien ne correspond à « {q} ».",
        jump: "Aller à",
        actions: "Actions",
        view: "Affichage",
        help: "Aide",
        newSection: "Nouvelle section libre",
        autofill: "Remplir depuis GitHub",
        exportConfig: "Exporter la configuration (.json)",
        importConfig: "Importer une configuration…",
        reset: "Tout réinitialiser…",
        switchLanguage: "Switch to English",
        ghTheme: "Basculer le thème de l’aperçu GitHub",
        viewRaw: "Afficher la source Markdown",
        viewRendered: "Afficher l’aperçu rendu",
        tour: "Revoir la visite guidée",
        bug: "Signaler un bug ou une idée",
        navigate: "naviguer",
        run: "lancer",
        close: "fermer"
      },
      tour: {
        progress: "Étape {n} sur {total}",
        back: "Retour",
        steps: {
          autofill: {
            title: "Partir de GitHub",
            body: "Entrez votre pseudo et on remplit ce que GitHub sait de vous. Vous pouvez aussi passer cette étape et tout écrire vous-même."
          },
          outline: {
            title: "Votre README, dans l’ordre",
            body: "Toutes les sections, dans l’ordre où elles apparaîtront. Glissez une poignée pour en déplacer une ; un point vert indique qu’elle est active.",
            bodyCompact: "Vos sections sont derrière ce bouton : ouvrez-le pour passer de l’une à l’autre ou les glisser dans un nouvel ordre."
          },
          plate: {
            title: "Une section à la fois",
            body: "Chaque section a sa propre page. Remplissez un champ et la section rejoint votre README."
          },
          preview: {
            title: "Relisez comme sur GitHub",
            body: "L’aperçu reprend les styles de GitHub. Passez en clair ou en sombre, lisez le Markdown brut, ou cliquez sur un bloc pour le modifier."
          },
          export: {
            title: "À vous de publier",
            body: "Copiez le Markdown ou téléchargez README.md, puis ajoutez-le à votre dépôt pseudo/pseudo. Ctrl+K (⌘K sur Mac) ouvre toutes les commandes."
          }
        }
      },
      confirm: {
        cancel: "Annuler"
      },
      reset: {
        done: "Tout a été réinitialisé",
        undo: "Annuler",
        restored: "Votre README est de retour"
      },
      banner: {
        urlLabel: "URL de l’image",
        loadError: "Impossible de charger cette image. Vérifiez que l’URL pointe vers une image.",
        previewAlt: "Aperçu de la bannière"
      },
      typing: {
        colorHint: "Laissez vide pour la couleur par défaut, F1F1F1.",
        pickColor: "Choisir une couleur",
        previewAlt: "Aperçu de l’animation de texte"
      },
      bio: {
        identity: "Identité",
        facts: "En bref",
        factsHint: "Chaque info remplie devient une puce. Le libellé en italique devant elle se modifie aussi.",
        factLabel: "Libellé de « {field} »",
        freeLinesHint: "Des puces en plus, reprises telles que vous les tapez. Le Markdown fonctionne.",
        placeholders: {
          name: "Ada Lovelace",
          title: "Développeuse fullstack",
          currentWork: "Nom ou URL du projet",
          learning: "Un langage, un framework…",
          collaboration: "Projets open source…",
          askMeAbout: "Sujets que vous maîtrisez",
          pronouns: "elle, il, iel…",
          funFact: "J’adore la pizza…"
        }
      },
      badges: {
        hint: "Tout ce que shields.io sait dessiner : un texte, une couleur, un logo et un lien facultatifs.",
        hintWithLink: "Tout ce que shields.io sait dessiner. Un badge a besoin d’un texte et d’un lien pour apparaître.",
        incomplete: "Ajoutez un texte pour afficher ce badge.",
        incompleteWithLink: "Ajoutez un texte et un lien pour afficher ce badge."
      },
      skills: {
        library: "Bibliothèque",
        viewLabel: "Affichage",
        searchLabel: "Rechercher",
        selected: "{n} sélectionnée(s)",
        remove: "Retirer {label}",
        noResults: "Aucune techno ne correspond à « {q} »."
      },
      github: {
        setUsername: "Renseigner votre pseudo GitHub",
        online: "en ligne",
        offline: "hors ligne",
        checking: "vérification",
        usernameHint: "Utilisé par toutes les cartes, et par les sections Projets, Réseau et Stats modernes.",
        cards: "Cartes",
        serviceOffline: "Ce service est hors ligne pour le moment.",
        themeHint: "S’applique aux cartes de stats, langages, séquence, trophées et projets."
      },
      statstats: {
        needsUser: "Ces cartes ont besoin de votre pseudo GitHub.",
        pick: "Cartes à afficher",
        look: "Apparence",
        previews: "Aperçu des cartes",
        sampleNote: "Les aperçus utilisent un profil d’exemple tant que votre pseudo n’est pas renseigné."
      },
      wakatime: {
        usernameLabel: "Pseudo WakaTime (pour le graphique)",
        badgeId: "ID du badge (UUID)",
        badgeHelp: "Dans vos réglages WakaTime, rubrique « Embeddable badges ».",
        offline: "WakaTime est injoignable pour le moment : le graphique risque de ne pas s’afficher."
      },
      socials: {
        profiles: "Profils",
        placeholders: {
          linkedin: "pseudo ou URL du profil",
          twitter: "@pseudo",
          portfolio: "https://…",
          email: "vous@exemple.com"
        }
      },
      donations: {
        platforms: "Plateformes",
        placeholder: "pseudo"
      },
      projects: {
        needsUser: "Les projets épinglés ont besoin de votre pseudo GitHub.",
        repoLabel: "Nom du dépôt",
        exists: "Ce dépôt est déjà épinglé.",
        emptyBody: "Ajoutez un nom de dépôt : il apparaîtra sous forme de carte.",
        remove: "Retirer {repo}"
      },
      followers: {
        needsUser: "Les abonnés ont besoin de votre pseudo GitHub.",
        limitHint: "Nombre d’avatars à récupérer pour la grille."
      },
      spotify: {
        urlLabel: "URL de la carte Spotify"
      },
      rss: {
        urlLabel: "URL du flux"
      },
      custom: {
        deleted: "Section supprimée",
        undo: "Annuler"
      }
    },

    // --- Moteur README étendu (modèles, nouvelles sections, workflows, bilan, partage) ---
    engine: {
      common: {
        add: "Ajouter",
        remove: "Supprimer",
        moveUp: "Monter",
        moveDown: "Descendre",
        enable: "Activé",
        copy: "Copier",
        copied: "Copié",
        download: "Télécharger",
        apply: "Appliquer",
        cancel: "Annuler",
        loading: "Chargement…",
        sectionTitle: "Titre de la section",
        sectionTitleHelp: "Vide = pas de titre",
        theme: "Thème",
        style: "Mise en forme",
        none: "Aucun",
        needsUsername: "Nécessite votre pseudo GitHub (section Stats ou pré-remplissage).",
        previewAlt: "Aperçu en direct"
      },
      sections: {
        headerBanner: "🌊 En-tête animé",
        footerBanner: "🌊 Pied de page animé",
        activity: "📈 Graphe d'activité",
        summaryCards: "🧾 Cartes de synthèse",
        quote: "💬 Citation / Blague",
        experience: "💼 Expérience / Parcours",
        currently: "⚡ En ce moment",
        pinned: "📌 Dépôts & gists épinglés"
      },
      help: {
        headerBanner: "// Une bannière capsule-render en ouverture du profil",
        footerBanner: "// Une vague capsule-render pour conclure le profil",
        activity: "// Votre courbe de contributions des derniers jours",
        summaryCards: "// Profil, langages, stats et heures productives",
        quote: "// Une citation de dev ou une blague de programmeur à chaque visite",
        experience: "// Postes, organisations et dates en tableau ou en liste",
        currently: "// Ce sur quoi vous travaillez, ce que vous lisez, écoutez…",
        pinned: "// Des dépôts de n'importe quel compte et des gists, avec vos mots"
      },
      capsule: {
        enable: "Afficher cette bannière",
        type: "Forme",
        colorMode: "Couleurs",
        colorModes: {
          gradient: "Dégradé aléatoire",
          auto: "Couleur aléatoire",
          timeGradient: "Dégradé du jour",
          timeAuto: "Couleur du jour",
          random: "Surprise",
          solid: "Couleur unie",
          customGradient: "Dégradé personnalisé"
        },
        color: "Couleur",
        color2: "Fin du dégradé",
        height: "Hauteur (px)",
        text: "Texte",
        textHelp: "{name} = votre nom · {title} = votre poste · retour à la ligne = saut de ligne",
        desc: "Sous-titre",
        fontColor: "Couleur du texte",
        fontColorHelp: "Vide = automatique",
        fontSize: "Taille du texte",
        fontAlignY: "Position verticale du texte (%)",
        descSize: "Taille du sous-titre",
        descAlignY: "Position verticale du sous-titre (%)",
        animation: "Animation du texte",
        animations: {
          none: "Aucune",
          fadeIn: "Fondu",
          scaleIn: "Zoom",
          blink: "Clignement",
          blinking: "Clignotement",
          twinkling: "Scintillement"
        },
        reversal: "Inverser la forme",
        textBg: "Surligner le texte"
      },
      activity: {
        enable: "Afficher le graphe d'activité",
        days: "Jours affichés",
        height: "Hauteur (px)",
        radius: "Arrondi des coins",
        area: "Remplir sous la courbe",
        hideBorder: "Masquer la bordure",
        hideTitle: "Masquer le titre",
        customTitle: "Titre personnalisé",
        customTitleHelp: "Vide = titre par défaut"
      },
      summary: {
        cards: "Cartes",
        kinds: {
          "profile-details": "Détails du profil",
          "repos-per-language": "Langages par dépôt",
          "most-commit-language": "Langages par commit",
          stats: "Statistiques",
          "productive-time": "Heures productives"
        },
        animation: "Animation d'entrée",
        source: "Rendu",
        sources: {
          hosted: "API publique",
          action: "GitHub Action (sans limite)"
        },
        sourceActionHelp: "Les cartes sont générées chaque jour dans votre dépôt de profil par un workflow (voir Workflows). Elles couvrent tous vos dépôts.",
        timeZone: "Fuseau horaire (heures productives)",
        timeZoneHelp: "Nom IANA, ex. Europe/Paris — vide = UTC",
        exclude: "Langages à masquer",
        excludeHelp: "Séparés par des virgules, ex. HTML,Jupyter Notebook"
      },
      quote: {
        enable: "Afficher la carte",
        kind: "Carte",
        kinds: {
          quote: "Citation de dev",
          joke: "Blague de programmeur"
        },
        layout: "Mise en page",
        font: "Police",
        animation: "Animation",
        category: "Catégorie",
        anyCategory: "Toutes",
        hideBorder: "Masquer la bordure"
      },
      experience: {
        add: "Ajouter un poste",
        role: "Poste",
        org: "Organisation",
        link: "Lien (optionnel)",
        start: "Début",
        end: "Fin",
        endHelp: "Vide = aujourd'hui",
        description: "Description (optionnelle)",
        styles: {
          table: "Tableau",
          list: "Liste"
        },
        empty: "Aucun poste pour l'instant."
      },
      currently: {
        add: "Ajouter une ligne",
        kind: "Type",
        kinds: {
          working: "Je travaille sur",
          learning: "J'apprends",
          reading: "Je lis",
          listening: "J'écoute",
          watching: "Je regarde",
          playing: "Je joue à",
          building: "Je construis",
          writing: "J'écris",
          custom: "Personnalisé"
        },
        label: "Libellé",
        labelHelp: "Vide = libellé par défaut dans la langue du README",
        value: "Valeur",
        link: "Lien (optionnel)",
        styles: {
          table: "Tableau",
          list: "Liste"
        },
        empty: "Rien pour l'instant."
      },
      pinned: {
        addRepo: "Épingler un dépôt",
        addGist: "Épingler un gist",
        kinds: {
          repo: "Dépôt",
          gist: "Gist"
        },
        owner: "Propriétaire",
        ownerHelp: "Vide = votre pseudo GitHub",
        repoName: "Nom du dépôt",
        gistId: "Identifiant du gist",
        description: "Votre description",
        styles: {
          cards: "Cartes",
          grid: "Grille",
          list: "Liste texte"
        },
        stylesHelp: "La liste texte ne dépend d'aucun service d'images : elle s'affiche toujours.",
        empty: "Rien d'épinglé pour l'instant."
      },
      skillIcons: {
        display: "Affichage",
        displays: {
          badges: "Badges",
          icons: "Grille d'icônes"
        },
        perLine: "Icônes par ligne",
        theme: "Fond des icônes",
        themes: {
          dark: "Sombre",
          light: "Clair",
          auto: "Suivre le thème GitHub"
        },
        missing: "{count} compétence(s) sans icône skillicons.dev restent en badges : {names}."
      },
      stats: {
        provider: "Hébergeur des cartes de stats",
        providers: {
          "github-readme-stats": "github-readme-stats (d'origine)",
          "github-stats-extended": "GitHub Stats Extended (maintenu)"
        },
        providerHelp: "github-readme-stats n'est plus maintenu ; GitHub Stats Extended est son successeur direct."
      },
      waka: {
        readme: "Bloc de stats WakaTime quotidien (GitHub Action)",
        readmeHelp: "Ajoute les marqueurs remplis chaque jour par athul/waka-readme. À configurer dans Workflows.",
        badgesNote: "Les badges de temps de code lisent vos statistiques WakaTime publiques : activez « Display code time publicly » et « Display languages publicly » sur WakaTime. Aucune clé d'API n'est jamais placée dans votre README."
      },
      rss: {
        maxPosts: "Articles affichés",
        feedsHelp: "Plusieurs flux ? Séparez les URLs par des virgules. Le workflow est généré dans Workflows."
      },
      templates: {
        label: "Modèles",
        help: "// Partez d'une mise en page complète et assumée — vos données restent",
        apply: "Utiliser ce modèle",
        applied: "Modèle appliqué",
        undo: "Annuler",
        keepsIdentity: "Un modèle ne change que la mise en page et le style : votre nom, vos liens, compétences et textes sont conservés. Annulable à tout moment (Ctrl/⌘ + Z)."
      },
      history: {
        undo: "Annuler",
        redo: "Rétablir",
        undoShortcut: "Annuler (Ctrl/⌘ + Z)",
        redoShortcut: "Rétablir (Ctrl/⌘ + Maj + Z)"
      },
      share: {
        button: "Lien de partage",
        copied: "Lien copié — il contient toute votre configuration",
        tooLong: "Le lien est très long ({length} caractères) : certaines applications risquent de le couper.",
        failed: "Impossible de créer le lien",
        loadTitle: "Charger le profil partagé ?",
        loadDescription: "Ce lien contient une configuration de profil. La charger remplace votre travail actuel (annulable juste après).",
        loadConfirm: "Le charger",
        loadCancel: "Garder le mien",
        loaded: "Profil partagé chargé",
        invalid: "Ce lien de partage est invalide ou abîmé"
      },
      workflows: {
        label: "Workflows (GitHub Actions)",
        help: "// Les automatisations dont certaines sections ont besoin dans votre dépôt de profil",
        none: "Aucune section activée n'a besoin d'un workflow. Le serpent, les articles de blog, le bloc WakaTime et les cartes de synthèse via Action en ont besoin.",
        secrets: "Secrets à créer",
        noSecret: "Aucun secret : le GITHUB_TOKEN intégré suffit.",
        steps: "Installation",
        copy: "Copier le YAML",
        download: "Télécharger",
        checkRepo: "Vérifier mon dépôt de profil",
        installed: "Installé",
        missing: "Introuvable",
        rateLimited: "Limite de l'API GitHub atteinte, réessayez plus tard.",
        noUsername: "Saisissez votre pseudo GitHub pour vérifier votre dépôt."
      },
      health: {
        label: "Bilan de santé du README",
        help: "// Score et corrections avant de publier",
        score: "Score",
        noFindings: "Rien à signaler : ce README est prêt à être publié.",
        fix: "Corriger",
        fixed: "Corrigé",
        recheck: "Revérifier les services",
        checkWorkflows: "Vérifier les workflows",
        severity: {
          error: "Erreur",
          warning: "Attention",
          info: "Conseil"
        },
        stats: "{sections} sections · {images} images · {badges} badges · {characters} caractères"
      },
      importer: {
        label: "Importer un README existant",
        help: "// Reprenez votre profil actuel au lieu de repartir de zéro",
        username: "Pseudo GitHub",
        fetch: "Récupérer le README",
        fetching: "Récupération…",
        notFound: "Aucun README trouvé dans {repo}.",
        rateLimited: "Limite de l'API GitHub atteinte, réessayez dans quelques minutes.",
        error: "Impossible de récupérer le README.",
        blocks: "Blocs de contenu",
        blocksHelp: "Votre contenu est présélectionné ; les widgets que le générateur sait recréer ne le sont pas.",
        kinds: {
          custom: "Votre contenu",
          generated: "Widgets",
          dynamic: "Mis à jour auto",
          empty: "Vide"
        },
        intro: "Introduction (avant le premier titre)",
        importSelected: "Importer {count} bloc(s) en sections libres",
        imported: "{count} section(s) libre(s) ajoutée(s)",
        suggestions: "Réglages détectés",
        suggestionsHelp: "Activez les fonctionnalités correspondantes du générateur.",
        applySuggestions: "Appliquer {count} réglage(s)",
        applied: "Réglages appliqués",
        selectAll: "Tous",
        selectNone: "Aucun",
        suggestionKinds: {
          statsCard: "Carte de stats",
          topLanguages: "Top langages",
          streak: "Carte de séquence",
          trophies: "Trophées",
          visitors: "Compteur de visites",
          snake: "Serpent des contributions",
          headerBanner: "En-tête animé",
          footerBanner: "Pied de page animé",
          typing: "Texte animé",
          skillIcons: "Icônes de compétences",
          activity: "Graphe d'activité",
          summaryCards: "Carte de synthèse",
          quote: "Carte citation",
          joke: "Carte blague",
          pinnedRepo: "Dépôt épinglé",
          pinnedGist: "Gist épinglé",
          wakaReadme: "Bloc WakaTime",
          wakatimeBadge: "Badge WakaTime",
          spotify: "Carte Spotify",
          skills: "Compétences",
          statsProvider: "GitHub Stats Extended"
        }
      }
    }
  }
};
