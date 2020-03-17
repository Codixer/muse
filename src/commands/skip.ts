import {Message} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player';
import QueueManager from '../managers/queue';
import Command from '.';

@injectable()
export default class implements Command {
  public name = 'skip';
  public examples = [
    ['skip', 'skips the current song']
  ];

  private readonly queueManager: QueueManager;
  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Queue) queueManager: QueueManager, @inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.queueManager = queueManager;
    this.playerManager = playerManager;
  }

  public async execute(msg: Message, _: string []): Promise<void> {
    const queue = this.queueManager.get(msg.guild!.id);

    try {
      queue.forward();

      if (queue.isEmpty()) {
        this.playerManager.get(msg.guild!.id).disconnect();
      } else {
        await this.playerManager.get(msg.guild!.id).play();
      }

      await msg.channel.send('keep \'er movin\'');
    } catch (_) {
      await msg.channel.send('no song to skip to');
    }
  }
}
