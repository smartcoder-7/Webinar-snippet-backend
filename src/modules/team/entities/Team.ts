import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { EWebinar } from '../../ewebinar/entities/EWebinar';
import Address, { AddressInput } from './Address';
import { TeamUserRelation } from './TeamUserRelation';
import { IDType } from '../../../types/IDType';
import { EWebinarSet } from '../../ewebinarSet/entities/EWebinarSet';
import { ORMObject } from '../../../types/ORMObject';
import { Presenter } from '../../presenter/entities/Presenter';

export enum BillingCycle {
  Year = 'Year',
  Month = 'Month',
}

registerEnumType(BillingCycle, {
  name: 'BillingCycle',
  description: 'The subscription billing cycles',
});

@ObjectType()
@Entity()
export class Team extends ORMObject<Team> {
  @Field()
  @PrimaryGeneratedColumn()
  public readonly id!: IDType;

  @Field(_type => [EWebinar])
  @OneToMany(
    _type => EWebinar,
    ewebinar => ewebinar.team
  )
  public ewebinars?: Promise<EWebinar[]>;

  @Field({ nullable: true, description: 'Team or Company Name' })
  @Column({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  public subdomain?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public logoMediaUrl?: string;

  @Field(_type => [TeamUserRelation], { name: 'users' })
  @OneToMany(
    _type => TeamUserRelation,
    relation => relation.team,
    { nullable: false }
  )
  public userRelations!: Promise<TeamUserRelation[]>;

  @Field(_type => [EWebinarSet])
  @OneToMany(
    _type => EWebinarSet,
    set => set.team
  )
  public sets?: Promise<EWebinarSet[]>;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public stripeCustomerId?: string;

  @Field({ description: 'Subscription ID on Stripe.  Grab "plan" to show user from there.' })
  @Column({ nullable: true })
  public stripeSubscriptionId?: string;

  @Field({
    nullable: false,
    description: 'Minimum number of webinars to charge for - Enterprise plans for example',
  })
  @Column({ default: 1 })
  public minimumPublicWebinars!: number;

  @Field({ nullable: false })
  @Column({ type: 'json', nullable: false })
  public address!: Address;

  @Field(_type => BillingCycle)
  @Column({ type: 'enum', enum: BillingCycle, default: BillingCycle.Month })
  public billingCycle?: BillingCycle;

  @Field({ nullable: true, description: 'Last 4 digits of CC used to subscribe' })
  @Column({ nullable: true })
  public last4?: string;

  @Field({ nullable: true, description: 'CC type' })
  @Column({ nullable: true })
  public ccType?: string;

  @Field(_type => [Presenter])
  @OneToMany(
    _type => Presenter,
    (presenter: Presenter) => presenter.team
  )
  public presenters?: Promise<Presenter[]>;
}

@InputType()
export class TeamInput implements Partial<Team> {
  @Field({ nullable: true })
  public id?: IDType;

  @Field({ nullable: true, description: 'Team or Company Name' })
  public name?: string;

  @Field({ nullable: true })
  public subdomain?: string;

  @Field({ nullable: true })
  public logoMediaUrl?: string;

  @Field({ nullable: true })
  public address?: AddressInput;

  @Field(_type => BillingCycle, { nullable: true })
  public billingCycle?: BillingCycle;

  @Field({ nullable: true })
  public stripeCustomerId?: string;

  @Field({ nullable: true, description: 'Last 4 digits of CC used to subscribe' })
  public last4?: string;

  @Field({ nullable: true, description: 'CC Type' })
  public ccType?: string;

  @Field({ nullable: true, description: 'Payment Method ID generated by Stipe JS Library' })
  public paymentMethodID?: string;
}
