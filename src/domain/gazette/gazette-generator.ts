import { Game } from '../game/game.aggregate.js';
import type { GameEvent } from '../game/game-event.js';
import { pickLang } from '../../infrastructure/i18n/language.js';

export interface GazetteStory {
  title: string;
  lines: string[];
}

/**
 * Generates an epic, hilarious theatrical story ("La Gazette du Village")
 * explicitly featuring player names and funny event breakdowns.
 */
export function generateGazette(
  game: Game,
  batches: (readonly GameEvent[])[],
  language: string = 'fr',
): GazetteStory {
  const playerMap = new Map(game.players.map((p) => [p.id, p.name]));

  const title = pickLang(
    language,
    '📜 <b>LA GAZETTE DU VILLAGE — ÉDITION HILARANTE DE FIN DE PARTIE</b> 🗞️',
    '📜 <b>THE VILLAGE GAZETTE — HILARIOUS END EDITION</b> 🗞️',
    '📜 <b>LA GACETA DE LA ALDEA — EDICIÓN HILARANTE DE FIN DE PARTIDA</b> 🗞️',
  );

  const lines: string[] = [];

  const winningTeam = game.winningTeam ?? 'Village';
  const totalPlayers = game.players.length;

  // Intro
  lines.push(
    pickLang(
      language,
      `<i>Le calme revient enfin sur Thiercelieux après un véritable feu d'artifice de trahisons entre ${totalPlayers} habitants ! Voici les nouvelles fraîches de la gazette :</i>\n`,
      `<i>Calm finally returns to Thiercelieux after a fireworks display of betrayals among ${totalPlayers} villagers! Here is the latest gossip from the gazette:</i>\n`,
      `<i>¡La calma vuelve por fin a Thiercelieux tras un auténtico espectáculo de traiciones entre ${totalPlayers} habitantes! Estas son las últimas noticias de la gaceta:</i>\n`,
    ),
  );

  // Parse events & group by type with player names
  const wolfVictims: string[] = [];
  const lynchVictims: string[] = [];
  const specialVictims: string[] = [];

  for (const batch of batches) {
    for (const event of batch) {
      if (event.type === 'PlayerDied') {
        const victimName =
          playerMap.get(event.playerId) ??
          pickLang(
            language,
            `Joueur #${event.playerId}`,
            `Player #${event.playerId}`,
            `Jugador #${event.playerId}`,
          );
        if (event.method === 'Eat') {
          wolfVictims.push(victimName);
        } else if (event.method === 'Lynch') {
          lynchVictims.push(victimName);
        } else {
          specialVictims.push(victimName);
        }
      }
    }
  }

  // Breakdown of deaths with comical commentary and player names
  if (wolfVictims.length > 0) {
    lines.push(
      pickLang(
        language,
        `🐺 <b>Casse-Croûte des Loups :</b>`,
        `🐺 <b>Wolf Midnight Snack:</b>`,
        `🐺 <b>Bocadito de los Lobos:</b>`,
      ),
    );
    wolfVictims.forEach((name) => {
      lines.push(
        pickLang(
          language,
          `  • <b>${name}</b> s'est fait dévorer en pyjama au beau milieu de la nuit !`,
          `  • <b>${name}</b> got munched on in pajamas in the dead of night!`,
          `  • ¡<b>${name}</b> fue devorado en pijama en plena noche!`,
        ),
      );
    });
    lines.push('');
  }
  if (lynchVictims.length > 0) {
    lines.push(
      pickLang(
        language,
        `⚖️ <b>Procès de la Potence :</b>`,
        `⚖️ <b>Gallows Trial:</b>`,
        `⚖️ <b>Juicio en la Horca:</b>`,
      ),
    );
    lynchVictims.forEach((name) => {
      lines.push(
        pickLang(
          language,
          `  • <b>${name}</b> a été traîné au gibet sous les tomates et les huées de la foule !`,
          `  • <b>${name}</b> was dragged to the rope amid flying tomatoes and crowd jeers!`,
          `  • ¡<b>${name}</b> fue arrastrado al patíbulo entre tomates y abucheos de la multitud!`,
        ),
      );
    });
    lines.push('');
  }
  if (specialVictims.length > 0) {
    lines.push(
      pickLang(
        language,
        `💥 <b>Morts Insolites & Magie Noire :</b>`,
        `💥 <b>Unusual Fatalities & Dark Magic:</b>`,
        `💥 <b>Muertes Insólitas y Magia Negra:</b>`,
      ),
    );
    specialVictims.forEach((name) => {
      lines.push(
        pickLang(
          language,
          `  • <b>${name}</b> a goûté à une balle en argent ou à une potion douteuse...`,
          `  • <b>${name}</b> tested out a silver bullet or a shady potion...`,
          `  • <b>${name}</b> probó una bala de plata o una poción dudosa...`,
        ),
      );
    });
    lines.push('');
  }

  // Survivors list
  const survivors = game.players.filter((p) => !p.isDead).map((p) => p.name);
  if (survivors.length > 0) {
    lines.push(
      pickLang(
        language,
        `🥂 <b>Les Glorieux Survivants :</b> <b>${survivors.join(', ')}</b> (qui fêtent ça à la taverne du village !)\n`,
        `🥂 <b>Glorious Survivors:</b> <b>${survivors.join(', ')}</b> (currently partying at the village pub!)\n`,
        `🥂 <b>Los Gloriosos Supervivientes:</b> <b>${survivors.join(', ')}</b> (¡festejándolo ahora mismo en la taberna del pueblo!)\n`,
      ),
    );
  } else {
    lines.push(
      pickLang(
        language,
        `🪦 <b>Cimetière Général :</b> Plus un seul habitant debout... le cimetière affiche complet !\n`,
        `🪦 <b>Ghost Town:</b> Not a single soul survived... absolute zero!\n`,
        `🪦 <b>Pueblo Fantasma:</b> No sobrevivió ni un alma... ¡cero absoluto!\n`,
      ),
    );
  }

  // Climax / Outcome
  const winningTeamStr = String(winningTeam);
  if (winningTeamStr === 'Village') {
    lines.push(
      pickLang(
        language,
        `✨ <b>DÉNOUEMENT :</b> Les villageois ont triomphé ! Les monstres sont démasqués et la sérénité revient à Thiercelieux.`,
        `✨ <b>OUTCOME:</b> The villagers won! The monsters were exposed and peace returns to Thiercelieux.`,
        `✨ <b>DESENLACE:</b> ¡Los aldeanos triunfaron! Los monstruos quedaron al descubierto y la serenidad vuelve a Thiercelieux.`,
      ),
    );
  } else if (winningTeamStr === 'Wolves' || winningTeamStr === 'Wolf') {
    lines.push(
      pickLang(
        language,
        `🐺 <b>DÉNOUEMENT :</b> Les loups ont croqué tout le monde ! Le village est devenu leur terrain de jeu personnel.`,
        `🐺 <b>OUTCOME:</b> The wolves ate everyone! The village is now their private kingdom.`,
        `🐺 <b>DESENLACE:</b> ¡Los lobos se comieron a todos! La aldea es ahora su reino privado.`,
      ),
    );
  } else if (winningTeamStr === 'Tanner') {
    lines.push(
      pickLang(
        language,
        `🤡 <b>DÉNOUEMENT :</b> Le Tanneur a berné toute la communauté et rigole aux éclats depuis la potence !`,
        `🤡 <b>OUTCOME:</b> The Tanner duped the entire town and is cackling happily from the gallows!`,
        `🤡 <b>DESENLACE:</b> ¡El Curtidor engañó a todo el pueblo y se ríe a carcajadas desde la horca!`,
      ),
    );
  } else if (winningTeamStr === 'Cult') {
    lines.push(
      pickLang(
        language,
        `🔮 <b>DÉNOUEMENT :</b> Le Culte a embrigadé tout le village. Tout le monde chante sous les étoiles !`,
        `🔮 <b>OUTCOME:</b> The Cult brainwashed the village. Everyone is chanting under the stars!`,
        `🔮 <b>DESENLACE:</b> El Culto lavó el cerebro de la aldea. ¡Todos cantan bajo las estrellas!`,
      ),
    );
  } else if (winningTeamStr === 'SerialKiller') {
    lines.push(
      pickLang(
        language,
        `🔪 <b>DÉNOUEMENT :</b> Le Tueur en série est le seul debout dans une clairière couverte de cadavres...`,
        `🔪 <b>OUTCOME:</b> The Serial Killer is the last soul standing in a clearing of fallen bodies...`,
        `🔪 <b>DESENLACE:</b> El Asesino en Serie es la única alma en pie en un claro cubierto de cuerpos...`,
      ),
    );
  } else {
    lines.push(
      pickLang(
        language,
        `🏆 <b>DÉNOUEMENT :</b> Victoire héroïque de l'équipe <b>${winningTeamStr}</b> !`,
        `🏆 <b>OUTCOME:</b> Epic victory for team <b>${winningTeamStr}</b>!`,
        `🏆 <b>DESENLACE:</b> ¡Victoria épica del equipo <b>${winningTeamStr}</b>!`,
      ),
    );
  }

  return { title, lines };
}
