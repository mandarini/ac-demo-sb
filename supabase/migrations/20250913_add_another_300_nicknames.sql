/*
  # Add Another 300 Fun Nicknames
  
  Adding 300 more additional creative and diverse nicknames to the nickname_pool
  to ensure we have plenty of unique names for all participants.
*/

-- Add 300 more creative nicknames
INSERT INTO nickname_pool (nick) VALUES
  -- Ancient Civilizations & Mythology
  ('AtlantisSeeker'), ('OlympianOracle'), ('SpartanWarrior'), ('RomanLegion'), ('EgyptianPharaoh'),
  ('MayanMystic'), ('AztecAdventurer'), ('IncaInnovator'), ('CelticChampion'), ('NorseNavigator'),
  ('VikingVoyager'), ('SamuraiSword'), ('NinjaNavigator'), ('ShogunSeeker'), ('RoninRanger'),
  ('GladiatorGuard'), ('CenturionChief'), ('LegionnaireLord'), ('BarbarianBoss'), ('CrusaderChampion'),
  
  -- Professions & Occupations
  ('ArchitectAce'), ('EngineerElite'), ('DoctorDynamo'), ('LawyerLegend'), ('TeacherTitan'),
  ('ScientistSage'), ('ArtistAdept'), ('WriterWizard'), ('JournalistJedi'), ('PhotographerPro'),
  ('FilmmakerPhenom'), ('DirectorDynamo'), ('ActorAce'), ('MusicianMaster'), ('DancerDazzle'),
  ('ChefChampion'), ('BakerBoss'), ('BaristaBrilliant'), ('WaiterWise'), ('ManagerMaven'),
  
  -- Transportation & Vehicles
  ('RocketRider'), ('JetPilot'), ('HelicopterHero'), ('BikeRider'), ('CarCruiser'),
  ('TruckDriver'), ('BusCommander'), ('TrainConductor'), ('ShipCaptain'), ('BoatNavigator'),
  ('SubmarineSeeker'), ('YachtYeoman'), ('MotorcycleMaster'), ('ScooterScout'), ('SkateboardStar'),
  ('RollerbladeRanger'), ('HoverboardHero'), ('SegwaySeeker'), ('UnicycleUnicorn'), ('TricycleTitan'),
  
  -- Instruments & Music
  ('PianoVirtuoso'), ('GuitarGuru'), ('ViolinVirtuoso'), ('CelloChampion'), ('FlutePhenom'),
  ('TrumpetTitan'), ('SaxophoneSeeker'), ('DrummerDynamo'), ('BassistBoss'), ('HarpistHero'),
  ('ClarinetChief'), ('OboeOracle'), ('TubaTitan'), ('TromboneTracker'), ('FrenchHornHero'),
  ('BanjoBuilder'), ('MandolinMaster'), ('UkuleleUnicorn'), ('AccordionAce'), ('HarmonicaHero'),
  
  -- Board Games & Puzzles
  ('ChessChampion'), ('CheckersChief'), ('ScrabbleSeeker'), ('MonopolyMaster'), ('RiskRanger'),
  ('ClueCracker'), ('SorrySeeker'), ('TriviaTriumph'), ('Jigsaw Genius'), ('CrosswordCrafter'),
  ('SudokuSolver'), ('RubiksMaster'), ('PokerPro'), ('BlackjackBoss'), ('BridgeBuilder'),
  ('GoGrandmaster'), ('BackgammonBoss'), ('ChineseCheckers'), ('ConnectFourChamp'), ('BattleshipBoss'),
  
  -- Hobbies & Crafts
  ('KnittingNinja'), ('CrochetChampion'), ('SewingSeeker'), ('QuiltingQueen'), ('EmbroideryExpert'),
  ('PotteryPro'), ('WoodworkingWizard'), ('MetalworkingMaster'), ('GlassblowingGuru'), ('JewelryJedi'),
  ('PaintingPioneer'), ('DrawingDynamo'), ('SketchingSeeker'), ('SculptingSage'), ('CarvingChampion'),
  ('OrigamiFolder'), ('CalligraphyChief'), ('LetteringLegend'), ('BookbindingBoss'), ('ScrapbookingSeeker'),
  
  -- Fitness & Health
  ('YogaYogi'), ('PilatesPro'), ('ZumbaZealot'), ('AerobicsAce'), ('CrossfitChampion'),
  ('BodybuilderBoss'), ('PowerlifterPro'), ('WeightliftingWizard'), ('CardioKing'), ('RunnerRanger'),
  ('JoggerJedi'), ('WalkerWise'), ('HikerHero'), ('ClimberChampion'), ('SwimmerSeeker'),
  ('CyclistChief'), ('SkierSeeker'), ('SnowboarderStar'), ('SurferSage'), ('SkateboarderScout'),
  
  -- Drinks & Beverages
  ('CoffeeConnoisseur'), ('TeaTaster'), ('WineWizard'), ('BeerBrewer'), ('CocktailCrafter'),
  ('SmoothieMaker'), ('JuiceJuggler'), ('SodaSipper'), ('WaterWise'), ('MilkMaster'),
  ('HotChocolateHero'), ('ChaiChampion'), ('MatchaMaster'), ('EspressoExpert'), ('LatteArtist'),
  ('CappuccinoChief'), ('MacchiatoMaster'), ('FrappeFighter'), ('IcedTeaIdol'), ('LemonadeLeader'),
  
  -- Seasons & Holidays
  ('SpringSeeker'), ('SummerSage'), ('AutumnAdept'), ('WinterWizard'), ('ChristmasCheer'),
  ('HalloweenHero'), ('EasterEgg'), ('ThanksgivingTurkey'), ('NewYearNinja'), ('ValentineVibes'),
  ('PatricksPride'), ('IndependenceIdol'), ('MemorialMaster'), ('LaborLeader'), ('ColumbusChampion'),
  ('VeteransVanguard'), ('PresidentsProud'), ('MothersDay'), ('FathersForce'), ('GrandparentsGuru'),
  
  -- Flowers & Plants
  ('RoseRanger'), ('TulipTender'), ('DaisyDancer'), ('SunflowerSeeker'), ('LilyLover'),
  ('OrchidOracle'), ('CarnationChief'), ('PeonyPro'), ('IrisIdol'), ('VioletVanguard'),
  ('DaffodilDynamo'), ('HyacinthHero'), ('CrocusChampion'), ('SnapdragonSeeker'), ('MarigoldMaster'),
  ('PetuniaProud'), ('BegoniaBoss'), ('ImpatienIdol'), ('GeraniumGuru'), ('PansyPioneer'),
  
  -- Trees & Nature
  ('OakOracle'), ('MapleMonarch'), ('PinePatrol'), ('BirchBoss'), ('WillowWise'),
  ('CedarChief'), ('RedwoodRanger'), ('SequoiaSeeker'), ('BambooBuilder'), ('PalmPilot'),
  ('CypressChampion'), ('ElmExplorer'), ('AshAdept'), ('BeechBoss'), ('HickoryHero'),
  ('WalnutWizard'), ('CherryChief'), ('AppleAdmirer'), ('PeachPioneer'), ('PlumProud'),
  
  -- Desserts & Sweets
  ('CakeCrafter'), ('CookieChief'), ('PieProducer'), ('DonutDynamo'), ('MuffinMaster'),
  ('CupcakeCreator'), ('BrownieBuilder'), ('FudgeFixer'), ('CandyMaker'), ('ChocolateChief'),
  ('IceCreamIdol'), ('SorbetSeeker'), ('GelatoGuru'), ('PuddingPro'), ('CustardChampion'),
  ('TiramisuTitan'), ('CheesecakeChief'), ('TartTender'), ('CrumbleCrafter'), ('TruffleTycoon'),
  
  -- Household Items
  ('VacuumVanguard'), ('MopMaster'), ('BroomBoss'), ('DusterDynamo'), ('SpongeSeeker'),
  ('TowelTitan'), ('PillowPro'), ('BlanketBoss'), ('SheetSeeker'), ('CurtainChief'),
  ('LampLighter'), ('CandleKeeper'), ('ClockWatcher'), ('MirrorMaster'), ('FrameFixer'),
  ('VaseVirtuoso'), ('PotPlanter'), ('BookshelfBoss'), ('TableTender'), ('ChairChampion'),
  
  -- Kitchen Appliances
  ('OvenOperator'), ('MicrowaveManager'), ('BlenderBoss'), ('MixerMaster'), ('ToasterTitan'),
  ('KettleKeeper'), ('CoffeeMaker'), ('FridgeFixer'), ('DishwasherDynamo'), ('StoveSeeker'),
  ('ProcessorPro'), ('GrinderGuru'), ('JuicerJedi'), ('RiceCookerRanger'), ('SlowCookerSage'),
  ('PressureCookerPro'), ('AirFryerAce'), ('DehydratorDynamo'), ('IceMakerIdol'), ('WaterFilterWise'),
  
  -- Office Supplies
  ('PenPilot'), ('PencilProud'), ('MarkerMaster'), ('HighlighterHero'), ('EraserExpert'),
  ('RulerRanger'), ('ScissorsSeeker'), ('StaplerStar'), ('PaperclipPro'), ('BinderBoss'),
  ('FolderFixer'), ('EnvelopeExpert'), ('StampSeeker'), ('TapeDispenser'), ('GlueGuru'),
  ('CalculatorChief'), ('ComputerCommander'), ('PrinterPro'), ('ScannerSeeker'), ('ShreddingStar')
ON CONFLICT (nick) DO NOTHING;
