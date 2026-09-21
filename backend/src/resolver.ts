import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service.js';
import { Palier, Product, World } from './graphql.js';

@Resolver('World')
export class GraphQlResolver {
  constructor(private readonly service: AppService) {}

  @Query()
  getWorld(@Args('user') user: string): World {
    return this.withUpdatedWorld(user, (world) => world);
  }

  @Mutation()
  acheterQtProduit(
    @Args('user') user: string,
    @Args('id') id: number,
    @Args('quantite') quantite: number,
  ): Product {
    return this.withUpdatedWorld(user, (world) =>
      this.service.buyProduct(world, id, quantite),
    );
  }

  @Mutation()
  lancerProductionProduit(
    @Args('user') user: string,
    @Args('id') id: number,
  ): Product {
    return this.withUpdatedWorld(user, (world) =>
      this.service.launchProduction(world, id),
    );
  }

  @Mutation()
  engagerManager(
    @Args('user') user: string,
    @Args('name') name: string,
  ): Palier {
    return this.withUpdatedWorld(user, (world) =>
      this.service.hireManager(world, name),
    );
  }

  @Mutation()
  acheterCashUpgrade(
    @Args('user') user: string,
    @Args('name') name: string,
  ): Palier {
    return this.withUpdatedWorld(user, (world) =>
      this.service.buyCashUpgrade(world, name),
    );
  }

  @Mutation()
  acheterAngelUpgrade(
    @Args('user') user: string,
    @Args('name') name: string,
  ): Palier {
    return this.withUpdatedWorld(user, (world) =>
      this.service.buyAngelUpgrade(world, name),
    );
  }

  @Mutation()
  resetWorld(@Args('user') user: string): World {
    const current = this.service.readUserWorld(user);
    this.service.updateWorld(current);
    const reset = this.service.resetWorld(current);
    this.service.saveWorld(user, reset);
    return reset;
  }

  private withUpdatedWorld<T>(user: string, action: (world: World) => T): T {
    const world = this.service.readUserWorld(user);
    this.service.updateWorld(world);
    const result = action(world);
    this.service.saveWorld(user, world);
    return result;
  }
}
