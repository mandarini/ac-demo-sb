/*
  # Add 300 More Fun Nicknames
  
  Adding 300 additional creative and diverse nicknames to the nickname_pool
  to ensure we have enough unique names for all participants.
*/

-- Add 300 more creative nicknames
INSERT INTO nickname_pool (nick) VALUES
  -- Mythical & Fantasy Creatures
  ('DragonSlayer'), ('PhoenixRider'), ('UnicornWhisperer'), ('GriffinGuardian'), ('KrakenKeeper'),
  ('CentaurChief'), ('MinotaurMaster'), ('HydraHunter'), ('ChimeraChaser'), ('BasiliskBane'),
  ('WyvernWarden'), ('PegasusPatrol'), ('SphinxSeeker'), ('CyclopsChampion'), ('TitanTamer'),
  ('GorgonGuard'), ('SirenSinger'), ('BansheeBeater'), ('ValkyrieVanguard'), ('FenrirFighter'),
  
  -- Space & Astronomy
  ('StarNavigator'), ('GalaxyGuardian'), ('NebulaExplorer'), ('CometChaser'), ('AsteroidAce'),
  ('PlanetHopper'), ('MeteorMaster'), ('SupernovaSeeker'), ('QuasarQuester'), ('PulsarPioneer'),
  ('BlackHoleHunter'), ('WormholeWanderer'), ('SpaceStationCommander'), ('RocketRanger'), ('SatelliteScout'),
  ('OrbitOfficer'), ('CosmicCruiser'), ('InterstellarIdol'), ('GalacticGuru'), ('UniverseExplorer'),
  
  -- Ocean & Marine Life
  ('DeepSeaDiver'), ('OceanExplorer'), ('WaveRider'), ('TidalMaster'), ('CoralKeeper'),
  ('SeahorseSeeker'), ('DolphinDancer'), ('WhaleWhisperer'), ('SharkTamer'), ('OctopusOracle'),
  ('JellyfishJuggler'), ('StarfishSeeker'), ('CrabCommander'), ('LobsterLord'), ('TurtleTracker'),
  ('MantaRayMaster'), ('BarracudaBoss'), ('AnglerfishAce'), ('SwordfishSentry'), ('StingrayStorm'),
  
  -- Weather & Natural Phenomena
  ('ThunderMaster'), ('LightningLord'), ('RainbowRanger'), ('CloudChaser'), ('StormSeeker'),
  ('TornadoTamer'), ('HurricaneHero'), ('BlizzardBoss'), ('AuroraAdmirer'), ('EclipseExpert'),
  ('MeteorWatcher'), ('CometCatcher'), ('SolarFlareSeeker'), ('MoonbeamMaster'), ('SunriseScout'),
  ('TwilightTracker'), ('DawnDancer'), ('DuskDefender'), ('MidnightMage'), ('NoonNavigator'),
  
  -- Adventure & Exploration
  ('TreasureHunter'), ('MapMaker'), ('CompassKeeper'), ('PathFinder'), ('TrailBlazer'),
  ('MountainClimber'), ('CaveExplorer'), ('JungleNavigator'), ('DesertWanderer'), ('ArcticAdventurer'),
  ('SafariScout'), ('ExpeditionExpert'), ('QuestMaster'), ('RiddleSolver'), ('PuzzlePioneer'),
  ('MysteryMaven'), ('SecretSeeker'), ('ClueCollector'), ('EvidenceExpert'), ('DetectiveDynamo'),
  
  -- Music & Arts
  ('MelodyMaker'), ('RhythmRanger'), ('HarmonyHero'), ('BeatBoxer'), ('SymphonySeeker'),
  ('ConcertMaster'), ('OrchestralOracle'), ('JazzJuggler'), ('RockStar'), ('PopPioneer'),
  ('ClassicalChampion'), ('ElectronicExpert'), ('AcousticAce'), ('VocalVirtuoso'), ('InstrumentIdol'),
  ('ComposerChief'), ('ConductorCrown'), ('SongwriterSage'), ('LyricistLegend'), ('ProducerPro'),
  
  -- Food & Culinary
  ('ChefSupreme'), ('CookingCrafter'), ('RecipeMaster'), ('FlavorFinder'), ('SpiceSeeker'),
  ('TasteTester'), ('CulinaryCreator'), ('KitchenKing'), ('BakingBoss'), ('GrillGuru'),
  ('SauceSpecialist'), ('DessertDynamo'), ('PastryPro'), ('SoupSorcerer'), ('SaladSage'),
  ('PizzaPioneer'), ('BurgerBuilder'), ('TacoTitan'), ('SushiSamurai'), ('NoodleNinja'),
  
  -- Sports & Athletics
  ('GoalKeeper'), ('HomeRunHero'), ('TouchdownTitan'), ('SlamDunkStar'), ('AceServer'),
  ('SpeedSkater'), ('HighJumper'), ('LongDistance'), ('SprintStar'), ('MarathonMaster'),
  ('SwimChampion'), ('DiveExpert'), ('CycleSpeedster'), ('SkiSlalom'), ('BoardRider'),
  ('RockClimber'), ('PoleVaulter'), ('DiscusThrower'), ('JavelinJuggernaut'), ('ShotPutter'),
  
  -- Technology & Innovation
  ('CodeCrafter'), ('AlgorithmArtist'), ('DataDancer'), ('CloudComputer'), ('EdgeExplorer'),
  ('QuantumQuester'), ('NanoNavigator'), ('BioTechBuilder'), ('RoboticRanger'), ('AIArchitect'),
  ('MLMagician'), ('BlockchainBard'), ('CryptoCreator'), ('NFTNavigator'), ('MetaverseMaster'),
  ('VRVirtuoso'), ('ARAdventurer'), ('IoTInnovator'), ('5GGuru'), ('WiFiWizard'),
  
  -- Animals & Wildlife
  ('LionHeart'), ('EagleEye'), ('WolfPack'), ('BearStrong'), ('FoxCunning'),
  ('OwlWise'), ('HawkHunter'), ('FalconFast'), ('PantherProwl'), ('CheetahChase'),
  ('ElephantMemory'), ('RhinoRush'), ('HippoHuge'), ('GiraffeGiant'), ('ZebraStripe'),
  ('KangarooKick'), ('KoalaCuddle'), ('PandaPeace'), ('TigerTough'), ('JaguarJump'),
  
  -- Gems & Precious Materials
  ('DiamondDazzle'), ('RubyRed'), ('SapphireBlue'), ('EmeraldGreen'), ('TopazGlow'),
  ('AmethystPurple'), ('OpalShimmer'), ('PearlWhite'), ('GoldRush'), ('SilverShine'),
  ('PlatinumPure'), ('CopperCraft'), ('BronzeBrave'), ('IronWill'), ('SteelStrong'),
  ('TitaniumTough'), ('CarbonCore'), ('CrystalClear'), ('QuartzQuick'), ('ObsidianEdge'),
  
  -- Colors & Art
  ('CrimsonCrafter'), ('ScarletSeeker'), ('VermillionVirtuoso'), ('CeruleanChief'), ('AzureArtist'),
  ('TurquoiseTitan'), ('VioletVanguard'), ('IndigoInnovator'), ('MagentaMaster'), ('CyanCreator'),
  ('YellowYeoman'), ('OrangeOracle'), ('GreenGuru'), ('BlueBuilder'), ('RedRanger'),
  ('PurplePioneer'), ('PinkProdigy'), ('BrownBoss'), ('GrayGuardian'), ('BlackBlade'),
  
  -- Time & History
  ('TimeKeeper'), ('ChronoChampion'), ('HistoryHunter'), ('AncientAdventurer'), ('ModernMaster'),
  ('FutureFinder'), ('PastPatroller'), ('PresentPro'), ('EternalExplorer'), ('TemporalTitan'),
  ('CenturySeeker'), ('DecadeDefender'), ('YearYeoman'), ('MonthMaster'), ('WeekWarrior'),
  ('DayDancer'), ('HourHero'), ('MinuteMage'), ('SecondSeeker'), ('InstantIdol'),
  
  -- Elements & Chemistry
  ('HydrogenHero'), ('HeliumHigh'), ('LithiumLord'), ('CarbonCore'), ('NitrogenNavigator'),
  ('OxygenOracle'), ('FluorineFlash'), ('NeonNinja'), ('SodiumSeeker'), ('MagnesiumMaster'),
  ('AluminumAce'), ('SiliconSage'), ('PhosphorusPhoenix'), ('SulfurStorm'), ('ChlorineChief'),
  ('ArgonArtist'), ('PotassiumKing'), ('CalciumChampion'), ('IronIdol'), ('CopperCrafter'),
  
  -- Gaming & Entertainment
  ('PixelPusher'), ('QuestMaster'), ('LevelBoss'), ('PowerUpPro'), ('HighScoreHero'),
  ('AchievementAce'), ('LeaderboardLegend'), ('BossBeater'), ('SpeedRunner'), ('CompletionistChamp'),
  ('RetroGamer'), ('ArcadeAce'), ('ConsoleCommander'), ('PCMaster'), ('MobileGamer'),
  ('StreamStar'), ('EsportsElite'), ('TournamentTitan'), ('ChampionshipChaser'), ('VictoryVanguard')
ON CONFLICT (nick) DO NOTHING;
