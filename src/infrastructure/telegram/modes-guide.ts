import { InlineKeyboard, type Bot, type Context } from 'grammy';
import type { GameMode } from '../../domain/game/game-mode.js';
import type { GroupRepository } from '../persistence/group.repository.js';
import { baseLanguage, type BaseLang } from '../i18n/language.js';

interface ModeInfo {
  title: string;
  command: string;
  emoji: string;
  atmosphere: string;
  description: string;
  keyRoles: string;
}

/** Base languages the modes guide ships wording for. Everything else falls back to `en`, the
 * default locale - exactly like `Translator`'s own requested -> base -> default chain. */
type Lang = BaseLang;

const MODES_DATA_EN: Record<GameMode, ModeInfo> = {
  Normal: {
    emoji: '📜',
    title: 'Normal Mode',
    command: '/startgame (or /start)',
    atmosphere: 'Balanced, tactical and authentic',
    description:
      'The classic, balanced Werewolf mode. An algorithm automatically adjusts the strength between the Village and the Wolves/Killers based on the number of players.',
    keyRoles: 'Villagers, Seer, Guardian Angel, Werewolves, Harlot, Hunter.',
  },
  Chaos: {
    emoji: '🎲',
    title: 'Chaos Mode',
    command: '/startchaos',
    atmosphere: 'Total madness, unpredictable and hilarious',
    description:
      'No balancing algorithm! All roles are assigned 100% at random. There can be 3 Serial Killers, 0 Seers or a giant pack.',
    keyRoles: 'Any role among the 63 available!',
  },
  Bloodbath: {
    emoji: '🩸',
    title: 'Bloodbath Mode',
    command: '/startbloodbath',
    atmosphere: 'Ultra-aggressive with a quick bloodbath',
    description:
      'Maximum rate of killer and armed roles. Nights are extremely deadly and games follow one another at full speed!',
    keyRoles: 'Serial Killer, Arsonist, Alpha Wolf, Hitman, Hunter, Chemist.',
  },
  DarkMagic: {
    emoji: '🔮',
    title: 'Dark Magic Mode',
    command: '/startdarkmagic',
    atmosphere: 'Spells, resurrections and mysticism',
    description:
      'Occult forces dominate the village. Magical and divinatory powers clash under the moon.',
    keyRoles: 'Sorcerer, Chemist, Necromancer, Seer, Oracle, Augur, Reflector Mirror.',
  },
  WolfPack: {
    emoji: '🐺',
    title: 'Wild Pack Mode',
    command: '/startwolfpack',
    atmosphere: 'Fierce hunt and Village survival',
    description: 'The Werewolves rule supreme with all their most feared special sub-roles.',
    keyRoles: 'Berserker Wolf, Hypnotist Wolf, Trapper Wolf, Howler Wolf, Snow Wolf.',
  },
  CursedVillage: {
    emoji: '💀',
    title: 'Cursed Village Mode',
    command: '/startcursedvillage',
    atmosphere: 'Paranoia, curses and betrayals',
    description:
      'An evil mist descends on the village. Curses and vengeful spirits poison the day vote.',
    keyRoles: 'Cursed, Cultists, Vengeful spirits, Avenger, Cursing Crow.',
  },
  Infection: {
    emoji: '🧪',
    title: 'Contagion Mode',
    command: '/startinfection',
    atmosphere: 'Mutations and nightly conversions',
    description:
      'Conversion forces are multiplied! Team compositions shift continuously through the night.',
    keyRoles: 'Cult, Alpha Wolf (biter), Doppelganger, Wild Child, Thief.',
  },
  Anarchy: {
    emoji: '💥',
    title: 'Anarchy Mode',
    command: '/startanarchy',
    atmosphere: 'Every player for themselves, bluffs and low blows',
    description:
      'Maximum concentration of lone neutral roles. No alliance is safe - it is every player for themselves!',
    keyRoles: 'Tanner, Jester, Hitman, Avenger, Thief, Arsonist.',
  },
  HolyWar: {
    emoji: '⚔️',
    title: 'Holy War Mode',
    command: '/startholywar',
    atmosphere: 'Divine light against Darkness',
    description:
      'A sacred clash between the Village\u2019s divine protectors and the dark forces of the Cult and the Wolves.',
    keyRoles: 'Priestess of Light, Exterminating Angel, Guardian Angel, Wise Elder.',
  },
  Assassins: {
    emoji: '🎯',
    title: 'Shadows & Assassins Mode',
    command: '/startassassins',
    atmosphere: 'Secret contracts, tailing and executions',
    description:
      'Every player receives a secret target or a contract to fulfil. Who will eliminate their target first?',
    keyRoles: 'Hitman, Avenger, Sniper, Detective, Cultist Hunter.',
  },
  TeamDuel: {
    emoji: '⚔️',
    title: 'Team Duel Mode',
    command: '/startduel',
    atmosphere: 'Two human squads, only one survives',
    description:
      'Players are split into two equal squads (an even player count is mandatory, 6 minimum). Each squad has a captain and can coordinate privately with /equipe followed by a message. Classic roles stay in play, but victory no longer depends on the usual sides: the squad with the most survivors at the end wins.',
    keyRoles:
      'Any Village or Werewolf role - solo roles (Tanner, Serial Killer, Arsonist, Cult...) are disabled in this mode.',
  },
};

const MODES_DATA_FR: Record<GameMode, ModeInfo> = {
  Normal: {
    emoji: '📜',
    title: 'Mode Normal',
    command: '/startgame (ou /start)',
    atmosphere: 'Équilibré, tactique et authentique',
    description:
      'Le mode Werewolf classique et équilibré. Un algorithme ajuste automatiquement les forces entre le Village et les Loups/Tueurs selon le nombre de participants.',
    keyRoles: 'Villageois, Voyante, Ange Gardien, Loups-Garous, Catin, Chasseur.',
  },
  Chaos: {
    emoji: '🎲',
    title: 'Mode Chaos',
    command: '/startchaos',
    atmosphere: 'Folie totale, imprévisible et hilarant',
    description:
      "Aucun algorithme d'équilibrage ! Tous les rôles sont attribués 100% au hasard. Il peut y avoir 3 Tueurs en série, 0 Voyante ou une meute géante.",
    keyRoles: "N'importe quel rôle parmi les 63 disponibles !",
  },
  Bloodbath: {
    emoji: '🩸',
    title: 'Mode Bain de Sang',
    command: '/startbloodbath',
    atmosphere: 'Ultra-agressif et hécatombe rapide',
    description:
      "Taux maximal de rôles tueurs et armés. Les nuits sont extrêmement mortelles et les parties s'enchaînent à toute vitesse !",
    keyRoles: 'Tueur en série, Pyromane, Loup Alpha, Franc-Tireur, Chasseur, Chimiste.',
  },
  DarkMagic: {
    emoji: '🔮',
    title: 'Mode Magie Noire',
    command: '/startdarkmagic',
    atmosphere: 'Sortilèges, résurrections et mystique',
    description:
      "Les forces occultes dominent le village. Les pouvoirs magiques et divinatoires s'affrontent sous la lune.",
    keyRoles: 'Sorcière, Chimiste, Nécromancien, Voyante, Oracle, Augure, Miroir Réflecteur.',
  },
  WolfPack: {
    emoji: '🐺',
    title: 'Mode Meute Sauvage',
    command: '/startwolfpack',
    atmosphere: 'Traque féroce et survie du Village',
    description:
      'Les Loups-Garous règnent en maîtres avec tous leurs sous-rôles spéciaux les plus redoutables.',
    keyRoles: 'Loup Berserker, Loup Hypnotiseur, Loup Piégeur, Loup Hurleur, Loup des Neiges.',
  },
  CursedVillage: {
    emoji: '💀',
    title: 'Mode Village Maudit',
    command: '/startcursedvillage',
    atmosphere: 'Paranoïa, malédictions et trahisons',
    description:
      "Une brume maléfique s'abat sur le village. Les malédictions et esprits vengeurs empoisonnent le vote du jour.",
    keyRoles: 'Maudits, Cultistes, Esprits vengeurs, Vengeur, Corbeau Maudisseur.',
  },
  Infection: {
    emoji: '🧪',
    title: 'Mode Contagion',
    command: '/startinfection',
    atmosphere: 'Mutations et conversions nocturnes',
    description:
      'Les forces de conversion sont décuplées ! La composition des équipes évolue continuellement pendant la nuit.',
    keyRoles: 'Culte, Loup Alpha (mordeur), Sosie, Enfant Sauvage, Voleur.',
  },
  Anarchy: {
    emoji: '💥',
    title: 'Mode Anarchie',
    command: '/startanarchy',
    atmosphere: 'Chacun pour soi, bluff et coups bas',
    description:
      "Concentration maximale de rôles neutres solitaires. Aucune alliance n'est sûre, le chacun pour soi est de mise !",
    keyRoles: 'Tanneur, Bouffon, Assassin à Gages, Vengeur, Voleur, Pyromane.',
  },
  HolyWar: {
    emoji: '⚔️',
    title: 'Mode Sainte Guerre',
    command: '/startholywar',
    atmosphere: 'Lumière divine contre Ténèbres',
    description:
      'Affrontement sacré entre les protecteurs divins du Village et les forces ténébreuses du Culte et des Loups.',
    keyRoles: 'Prêtresse de Lumière, Ange Exterminateur, Ange Gardien, Sage Ancien.',
  },
  Assassins: {
    emoji: '🎯',
    title: 'Mode Ombres & Assassins',
    command: '/startassassins',
    atmosphere: 'Contrats secrets, filatures et exécutions',
    description:
      'Chaque joueur reçoit une cible secrète ou un contrat à remplir. Qui éliminera sa cible en premier ?',
    keyRoles: 'Assassin à Gages, Vengeur, Franc-Tireur, Détective, Chasseur de Cultistes.',
  },
  TeamDuel: {
    emoji: '⚔️',
    title: "Mode Duel d'Équipes",
    command: '/startduel',
    atmosphere: 'Deux camps humains, une seule équipe survit',
    description:
      "Les joueurs sont divisés en deux équipes égales (nombre de joueurs pair obligatoire, 6 minimum). Chaque équipe a un capitaine et peut se concerter en privé avec /equipe suivi d'un message. Les rôles classiques restent en jeu, mais la victoire ne dépend plus des camps habituels : l'équipe qui compte le plus de survivants à la fin l'emporte.",
    keyRoles:
      "N'importe quel rôle Village ou Loup-Garou - les rôles solo (Tanneur, Tueur en Série, Pyromane, Culte...) sont désactivés dans ce mode.",
  },
};

const MODES_DATA_ES: Record<GameMode, ModeInfo> = {
  Normal: {
    emoji: '📜',
    title: 'Modo Normal',
    command: '/startgame (o /start)',
    atmosphere: 'Equilibrado, táctico y auténtico',
    description:
      'El modo Hombres Lobo clásico y equilibrado. Un algoritmo ajusta automáticamente las fuerzas entre la Aldea y los Lobos/Asesinos según el número de participantes.',
    keyRoles: 'Aldeanos, Vidente, Ángel de la Guarda, Hombres Lobo, Cortesana, Cazador.',
  },
  Chaos: {
    emoji: '🎲',
    title: 'Modo Caos',
    command: '/startchaos',
    atmosphere: 'Locura total, impredecible y divertidísima',
    description:
      '¡Sin algoritmo de equilibrio! Todos los roles se asignan 100% al azar. Puede haber 3 Asesinos en Serie, 0 Videntes o una manada gigante.',
    keyRoles: '¡Cualquier rol entre los 63 disponibles!',
  },
  Bloodbath: {
    emoji: '🩸',
    title: 'Modo Baño de Sangre',
    command: '/startbloodbath',
    atmosphere: 'Ultraagresivo y de hecatombe rápida',
    description:
      'Tasa máxima de roles asesinos y armados. ¡Las noches son extremadamente mortales y las partidas se suceden a toda velocidad!',
    keyRoles: 'Asesino en Serie, Incendiario, Lobo Alfa, Sicario, Cazador, Químico.',
  },
  DarkMagic: {
    emoji: '🔮',
    title: 'Modo Magia Negra',
    command: '/startdarkmagic',
    atmosphere: 'Sortilegios, resurrecciones y misticismo',
    description:
      'Las fuerzas ocultas dominan la aldea. Los poderes mágicos y adivinatorios se enfrentan bajo la luna.',
    keyRoles: 'Brujo, Químico, Nigromante, Vidente, Oráculo, Augur, Espejo Reflector.',
  },
  WolfPack: {
    emoji: '🐺',
    title: 'Modo Manada Salvaje',
    command: '/startwolfpack',
    atmosphere: 'Cacería feroz y supervivencia de la Aldea',
    description:
      'Los Hombres Lobo reinan como amos con todos sus subroles especiales más temibles.',
    keyRoles:
      'Lobo Berserker, Lobo Hipnotizador, Lobo Trampero, Lobo Aullador, Lobo de las Nieves.',
  },
  CursedVillage: {
    emoji: '💀',
    title: 'Modo Aldea Maldita',
    command: '/startcursedvillage',
    atmosphere: 'Paranoia, maldiciones y traiciones',
    description:
      'Una niebla maligna se cierne sobre la aldea. Las maldiciones y los espíritus vengativos envenenan el voto del día.',
    keyRoles: 'Malditos, Cultistas, Espíritus vengativos, Vengador, Cuervo Maldito.',
  },
  Infection: {
    emoji: '🧪',
    title: 'Modo Contagio',
    command: '/startinfection',
    atmosphere: 'Mutaciones y conversiones nocturnas',
    description:
      '¡Las fuerzas de conversión se multiplican! La composición de los equipos evoluciona continuamente durante la noche.',
    keyRoles: 'Culto, Lobo Alfa (mordedor), Doppelgänger, Niño Salvaje, Ladrón.',
  },
  Anarchy: {
    emoji: '💥',
    title: 'Modo Anarquía',
    command: '/startanarchy',
    atmosphere: 'Sálvese quien pueda, faroles y golpes bajos',
    description:
      'Concentración máxima de roles neutrales solitarios. Ninguna alianza es segura: ¡el sálvese quien pueda está a la orden del día!',
    keyRoles: 'Curtidor, Bufón, Sicario, Vengador, Ladrón, Incendiario.',
  },
  HolyWar: {
    emoji: '⚔️',
    title: 'Modo Guerra Santa',
    command: '/startholywar',
    atmosphere: 'Luz divina contra las Tinieblas',
    description:
      'Enfrentamiento sagrado entre los protectores divinos de la Aldea y las fuerzas tenebrosas del Culto y los Lobos.',
    keyRoles: 'Sacerdotisa de la Luz, Ángel Exterminador, Ángel de la Guarda, Anciano Sabio.',
  },
  Assassins: {
    emoji: '🎯',
    title: 'Modo Sombras y Asesinos',
    command: '/startassassins',
    atmosphere: 'Contratos secretos, seguimientos y ejecuciones',
    description:
      'Cada jugador recibe un objetivo secreto o un contrato que cumplir. ¿Quién eliminará a su objetivo primero?',
    keyRoles: 'Sicario, Vengador, Francotirador, Detective, Cazador de Cultistas.',
  },
  TeamDuel: {
    emoji: '⚔️',
    title: 'Modo Duelo de Equipos',
    command: '/startduel',
    atmosphere: 'Dos bandos humanos, solo un equipo sobrevive',
    description:
      'Los jugadores se dividen en dos equipos iguales (número de jugadores par obligatorio, mínimo 6). Cada equipo tiene un capitán y puede coordinarse en privado con /equipe seguido de un mensaje. Los roles clásicos siguen en juego, pero la victoria ya no depende de los bandos habituales: gana el equipo que cuente con más supervivientes al final.',
    keyRoles:
      'Cualquier rol de Aldea u Hombre Lobo: los roles en solitario (Curtidor, Asesino en Serie, Incendiario, Culto...) están desactivados en este modo.',
  },
};

interface ModesUi {
  header: string;
  backTitle: string;
  fieldCommand: string;
  fieldAtmosphere: string;
  fieldDescription: string;
  fieldKeyRoles: string;
  launchPrefix: string;
  backButton: string;
  launching: (modeKey: string) => string;
  groupRequired: (modeKey: string) => string;
  keyboard: Record<GameMode, string>;
}

const MODES_UI_EN: ModesUi = {
  header:
    `🎮 <b>INTERACTIVE WEREWOLF GAME MODES GUIDE</b> 🎮\n\n` +
    `The bot offers <b>11 unique game modes</b>! Each mode has its own style, atmosphere and role distribution.\n\n` +
    `👇 <i>Tap any mode below to discover its details, key roles and the command to launch it:</i>`,
  backTitle:
    `🎮 <b>INTERACTIVE WEREWOLF GAME MODES GUIDE</b> 🎮\n\n` +
    `The bot offers <b>11 unique game modes</b>! Tap a mode below to discover its specifics:`,
  fieldCommand: 'Command to launch:',
  fieldAtmosphere: 'Atmosphere:',
  fieldDescription: 'Description:',
  fieldKeyRoles: 'Key roles:',
  launchPrefix: '▶️ Launch in',
  backButton: '« Back to modes',
  launching: (modeKey) => `Launching ${modeKey} mode...`,
  groupRequired: (modeKey) =>
    `⚠️ <b>Group Game Required</b>\n\nTo play in <b>${modeKey}</b> mode, invite the bot to a Telegram group and type <code>/startgame</code>, or tap the launch button from the group!`,
  keyboard: {
    Normal: '📜 Normal',
    Chaos: '🎲 Chaos',
    Bloodbath: '🩸 Bloodbath',
    DarkMagic: '🔮 Dark Magic',
    WolfPack: '🐺 Wild Pack',
    CursedVillage: '💀 Cursed Village',
    Infection: '🧪 Contagion',
    Anarchy: '💥 Anarchy',
    HolyWar: '⚔️ Holy War',
    Assassins: '🎯 Assassins',
    TeamDuel: '⚔️ Team Duel',
  },
};

const MODES_UI_FR: ModesUi = {
  header:
    `🎮 <b>MANUEL INTERACTIF DES MODES DE JEU WEREWOLF</b> 🎮\n\n` +
    `Le bot propose <b>11 modes de jeu uniques</b> ! Chaque mode possède son propre style, son ambiance et sa distribution de rôles.\n\n` +
    `👇 <i>Cliquez sur n'importe quel mode ci-dessous pour découvrir ses détails, ses rôles phares et la commande pour le lancer :</i>`,
  backTitle:
    `🎮 <b>MANUEL INTERACTIF DES MODES DE JEU WEREWOLF</b> 🎮\n\n` +
    `Le bot propose <b>11 modes de jeu uniques</b> ! Cliquez sur un mode ci-dessous pour découvrir ses spécificités :`,
  fieldCommand: 'Commande pour lancer :',
  fieldAtmosphere: 'Ambiance :',
  fieldDescription: 'Description :',
  fieldKeyRoles: 'Rôles clés :',
  launchPrefix: '▶️ Lancer en Mode',
  backButton: '« Retour aux modes',
  launching: (modeKey) => `Lancement du Mode ${modeKey}...`,
  groupRequired: (modeKey) =>
    `⚠️ <b>Partie en Groupe Nécessaire</b>\n\nPour jouer en mode <b>${modeKey}</b>, invite le bot dans un groupe Telegram et tape <code>/startgame</code> ou clique sur le bouton de lancement depuis le groupe !`,
  keyboard: {
    Normal: '📜 Normal',
    Chaos: '🎲 Chaos',
    Bloodbath: '🩸 Bain de Sang',
    DarkMagic: '🔮 Magie Noire',
    WolfPack: '🐺 Meute Sauvage',
    CursedVillage: '💀 Village Maudit',
    Infection: '🧪 Contagion',
    Anarchy: '💥 Anarchie',
    HolyWar: '⚔️ Sainte Guerre',
    Assassins: '🎯 Assassins',
    TeamDuel: '⚔️ Duel d’Équipes',
  },
};

const MODES_UI_ES: ModesUi = {
  header:
    `🎮 <b>MANUAL INTERACTIVO DE LOS MODOS DE JUEGO DE HOMBRES LOBO</b> 🎮\n\n` +
    `¡El bot ofrece <b>11 modos de juego únicos</b>! Cada modo tiene su propio estilo, ambiente y distribución de roles.\n\n` +
    `👇 <i>Toca cualquier modo de abajo para descubrir sus detalles, sus roles clave y el comando para iniciarlo:</i>`,
  backTitle:
    `🎮 <b>MANUAL INTERACTIVO DE LOS MODOS DE JUEGO DE HOMBRES LOBO</b> 🎮\n\n` +
    `¡El bot ofrece <b>11 modos de juego únicos</b>! Toca un modo de abajo para descubrir sus particularidades:`,
  fieldCommand: 'Comando para iniciar:',
  fieldAtmosphere: 'Ambiente:',
  fieldDescription: 'Descripción:',
  fieldKeyRoles: 'Roles clave:',
  launchPrefix: '▶️ Iniciar en modo',
  backButton: '« Volver a modos',
  launching: (modeKey) => `Iniciando el modo ${modeKey}...`,
  groupRequired: (modeKey) =>
    `⚠️ <b>Se Necesita una Partida en Grupo</b>\n\nPara jugar en el modo <b>${modeKey}</b>, invita al bot a un grupo de Telegram y escribe <code>/startgame</code>, o pulsa el botón de inicio desde el grupo.`,
  keyboard: {
    Normal: '📜 Normal',
    Chaos: '🎲 Caos',
    Bloodbath: '🩸 Baño de Sangre',
    DarkMagic: '🔮 Magia Negra',
    WolfPack: '🐺 Manada Salvaje',
    CursedVillage: '💀 Aldea Maldita',
    Infection: '🧪 Contagio',
    Anarchy: '💥 Anarquía',
    HolyWar: '⚔️ Guerra Santa',
    Assassins: '🎯 Asesinos',
    TeamDuel: '⚔️ Duelo de Equipos',
  },
};

const MODES_DATA: Record<Lang, Record<GameMode, ModeInfo>> = {
  en: MODES_DATA_EN,
  fr: MODES_DATA_FR,
  es: MODES_DATA_ES,
};

const MODES_UI: Record<Lang, ModesUi> = {
  en: MODES_UI_EN,
  fr: MODES_UI_FR,
  es: MODES_UI_ES,
};

/** Resolves any Telegram/group locale code (e.g. `fr-FR`, `es-419`, `en-GB`) to one of the three
 * base languages the guide ships, defaulting to `en` - the default locale. */
export const normalizeModesLang = baseLanguage;

/** The wording a group (or, failing that, the caller) should see: group language wins over the
 * user's own Telegram locale, mirroring how the rest of the bot picks a language. */
async function resolveModesLang(ctx: Context, groupRepository?: GroupRepository): Promise<Lang> {
  const isGroup = ctx.chat?.type === 'group' || ctx.chat?.type === 'supergroup';
  if (isGroup && groupRepository) {
    try {
      const group = await groupRepository.findByTelegramId(BigInt(ctx.chat!.id));
      if (group?.language) return normalizeModesLang(group.language);
    } catch {
      // Ignore lookup failures - fall back to the caller's own locale below.
    }
  }
  return normalizeModesLang(ctx.from?.language_code);
}

import type { GameLobbyManager } from './game-lobby.js';

export function registerModesGuideCommands(
  bot: Bot,
  lobby?: GameLobbyManager,
  groupRepository?: GroupRepository,
): void {
  bot.command(['modes', 'mode', 'helpmodes', 'gamemodes'], async (ctx: Context) => {
    const lang = await resolveModesLang(ctx, groupRepository);
    const keyboard = buildModesKeyboard(lang);
    await ctx.reply(MODES_UI[lang].header, { parse_mode: 'HTML', reply_markup: keyboard });
  });

  bot.callbackQuery(/^mode_info:(.+)$/, async (ctx: Context) => {
    const modeKey = ctx.match![1] as GameMode;
    const lang = await resolveModesLang(ctx, groupRepository);
    const ui = MODES_UI[lang];
    const data = MODES_DATA[lang][modeKey];
    if (!data) return ctx.answerCallbackQuery();

    const text =
      `${data.emoji} <b>${data.title.toUpperCase()}</b>\n\n` +
      `🎯 <b>${ui.fieldCommand}</b> <code>${data.command}</code>\n` +
      `✨ <b>${ui.fieldAtmosphere}</b> <i>${data.atmosphere}</i>\n\n` +
      `📖 <b>${ui.fieldDescription}</b>\n${data.description}\n\n` +
      `🎭 <b>${ui.fieldKeyRoles}</b>\n${data.keyRoles}`;

    const keyboard = new InlineKeyboard()
      .text(`${ui.launchPrefix} ${data.title}`, `mode_start:${modeKey}`)
      .row()
      .text(ui.backButton, 'mode_list_back');

    await ctx.answerCallbackQuery();
    await ctx
      .editMessageText(text, { parse_mode: 'HTML', reply_markup: keyboard })
      .catch(() => null);
  });

  bot.callbackQuery(/^mode_start:(.+)$/, async (ctx: Context) => {
    if (!ctx.chat || !ctx.from || !lobby) return ctx.answerCallbackQuery();
    const modeKey = ctx.match![1] as GameMode;
    const lang = await resolveModesLang(ctx, groupRepository);
    await ctx.answerCallbackQuery({ text: MODES_UI[lang].launching(modeKey) });

    if (ctx.chat.type === 'private') {
      await ctx.reply(MODES_UI[lang].groupRequired(modeKey), { parse_mode: 'HTML' });
      return;
    }

    const name = `${ctx.from.first_name} ${ctx.from.last_name ?? ''}`.trim();
    await lobby.startGame(
      BigInt(ctx.chat.id),
      ctx.chat.title ?? null,
      { id: BigInt(ctx.from.id), name },
      modeKey,
    );
  });

  bot.callbackQuery('mode_list_back', async (ctx: Context) => {
    const lang = await resolveModesLang(ctx, groupRepository);
    const keyboard = buildModesKeyboard(lang);

    await ctx.answerCallbackQuery();
    await ctx
      .editMessageText(MODES_UI[lang].backTitle, { parse_mode: 'HTML', reply_markup: keyboard })
      .catch(() => null);
  });
}

function buildModesKeyboard(lang: Lang): InlineKeyboard {
  const label = MODES_UI[lang].keyboard;
  return new InlineKeyboard()
    .text(label.Normal, 'mode_info:Normal')
    .text(label.Chaos, 'mode_info:Chaos')
    .row()
    .text(label.Bloodbath, 'mode_info:Bloodbath')
    .text(label.DarkMagic, 'mode_info:DarkMagic')
    .row()
    .text(label.WolfPack, 'mode_info:WolfPack')
    .text(label.CursedVillage, 'mode_info:CursedVillage')
    .row()
    .text(label.Infection, 'mode_info:Infection')
    .text(label.Anarchy, 'mode_info:Anarchy')
    .row()
    .text(label.HolyWar, 'mode_info:HolyWar')
    .text(label.Assassins, 'mode_info:Assassins')
    .row()
    .text(label.TeamDuel, 'mode_info:TeamDuel');
}
