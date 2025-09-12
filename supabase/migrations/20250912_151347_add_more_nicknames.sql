/*
  # Add 200 More Fun Nicknames
  
  Adding 200 additional creative and conference-themed nicknames to the nickname_pool
  to ensure we have enough unique names for all participants.
*/

-- Add 200 more creative nicknames
INSERT INTO nickname_pool (nick) VALUES
  -- Tech Conference Theme
  ('AngularAce'), ('ReactRanger'), ('VueVanguard'), ('SvelteSeeker'), ('NextNinja'),
  ('NuxtNavigator'), ('EmberExplorer'), ('BackboneBuilder'), ('KnockoutKnight'), ('JQueryJedi'),
  ('TypeScriptTitan'), ('JavaScriptJuggler'), ('PythonPioneer'), ('RustRanger'), ('GoGuru'),
  ('SwiftSorcerer'), ('KotlinKnight'), ('DartDynamo'), ('PhpPhantom'), ('RubyRanger'),
  ('CSharpChampion'), ('JavaJedi'), ('ScalaScout'), ('ClojureChief'), ('HaskellHero'),
  ('ErlangExpert'), ('ElixirElite'), ('FSharpFighter'), ('OcamlOracle'), ('LispLegend'),
  
  -- Development Tools
  ('GitGuru'), ('DockerDynamo'), ('KubernetesKing'), ('JenkinsJedi'), ('TravisTracker'),
  ('CircleCIChamp'), ('GitHubGuru'), ('GitLabGladiator'), ('BitbucketBoss'), ('SourceTreeStar'),
  ('VSCodeVirtuoso'), ('WebStormWarrior'), ('IntelliJIdol'), ('EclipseExpert'), ('VimVanguard'),
  ('EmacsElite'), ('SublimeSeeker'), ('AtomAdept'), ('BracketsBuilder'), ('NotepadNinja'),
  
  -- Web Technologies
  ('HTMLHero'), ('CSSChampion'), ('SASSSeeker'), ('LESSLegend'), ('BootstrapBoss'),
  ('TailwindTitan'), ('BulmaBuilder'), ('MaterialMaster'), ('AntDesignAce'), ('ChakraChief'),
  ('WebpackWizard'), ('ViteVanguard'), ('ParcelPioneer'), ('RollupRanger'), ('GulpGuru'),
  ('GruntGuardian'), ('NPMNinja'), ('YarnYeoman'), ('PnpmPioneer'), ('BunBuilder'),
  
  -- Database & Backend
  ('MongoMaster'), ('PostgresProdigy'), ('MySQLMaven'), ('RedisRanger'), ('ElasticExplorer'),
  ('GraphQLGuru'), ('RestAPIRanger'), ('NodeNavigator'), ('ExpressExpert'), ('KoaKnight'),
  ('NestNinja'), ('FastifyFighter'), ('HapiHero'), ('SocketSeeker'), ('PrismaProdigy'),
  
  -- Cloud & DevOps
  ('AWSAce'), ('AzureAdept'), ('GCPGuru'), ('HerokuHero'), ('VercelVanguard'),
  ('NetlifyNinja'), ('DigitalOceanDynamo'), ('LinodeLeader'), ('TerraformTitan'), ('AnsibleAce'),
  ('ChefChampion'), ('PuppetProdigy'), ('SaltStackStar'), ('VagrantVirtuoso'), ('PackerPioneer'),
  
  -- Testing & Quality
  ('JestJedi'), ('MochaMonarch'), ('ChaiChampion'), ('JasmineJuggler'), ('CypressChief'),
  ('SeleniumSeeker'), ('PlaywrightPro'), ('PuppeteerPioneer'), ('TestCafeTracker'), ('KarmaKnight'),
  ('ProtractorPro'), ('WebdriverWizard'), ('ESLintExpert'), ('PrettierPioneer'), ('SonarSeeker'),
  
  -- Mobile Development
  ('FlutterFighter'), ('ReactNativeRanger'), ('XamarinXpert'), ('IonicIdol'), ('CordovaChief'),
  ('PhoneGapPro'), ('NativeScriptNinja'), ('SwiftUISeeker'), ('JetpackJedi'), ('KotlinMPMaster'),
  
  -- Design & UI/UX
  ('FigmaFighter'), ('SketchSeeker'), ('AdobeAce'), ('InVisionIdol'), ('ZeplinZealot'),
  ('StorybookStar'), ('ChromaticChief'), ('DesignSystemDynamo'), ('ComponentCrafter'), ('PrototypePro'),
  
  -- Data & Analytics
  ('D3DataDynamo'), ('ChartJSChief'), ('PlotlyPioneer'), ('TableauTitan'), ('PowerBIProdigy'),
  ('GoogleAnalyticsGuru'), ('MixpanelMaster'), ('AmplitudeAce'), ('SegmentSeeker'), ('HotjarHero'),
  
  -- Security & Performance
  ('SecuritySentry'), ('PerformancePro'), ('OptimizationOracle'), ('LoadTestLegend'), ('PenTestPioneer'),
  ('CyberSecurityChief'), ('VulnerabilitVanguard'), ('ComplianceChampion'), ('AuditAce'), ('EncryptionExpert'),
  
  -- AI & Machine Learning
  ('TensorFlowTitan'), ('PyTorchPioneer'), ('KerasKnight'), ('ScikitSeeker'), ('PandasProdigy'),
  ('NumPyNinja'), ('JupyterJedi'), ('MLModelMaster'), ('DeepLearningDynamo'), ('NeuralNetNinja'),
  
  -- Blockchain & Web3
  ('BlockchainBuilder'), ('EthereumExpert'), ('SoliditySeeker'), ('Web3Wizard'), ('DeFiDynamo'),
  ('NFTNinja'), ('CryptoCrafter'), ('SmartContractStar'), ('MetaMaskMaster'), ('WalletWizard'),
  
  -- Gaming & Graphics
  ('UnityUnicorn'), ('UnrealUndertaker'), ('GodotGuru'), ('BlenderBuilder'), ('ThreeJSThief'),
  ('BabylonBoss'), ('PixiProdigy'), ('PhaserPhantom'), ('GameDevGuru'), ('ShaderSeeker'),
  
  -- Conference Fun
  ('TalkTracker'), ('SessionSeeker'), ('WorkshopWarrior'), ('KeynoteKnight'), ('PanelPro'),
  ('NetworkingNinja'), ('CoffeeBreakChamp'), ('LunchLearner'), ('HallwayHacker'), ('BoothBrowser'),
  ('SponsorSpotter'), ('SwagSeeker'), ('BadgeCollector'), ('QRCodeQuest'), ('LiveTweeter'),
  
  -- Creative & Fun
  ('CodePoet'), ('BugWhisperer'), ('PixelPusher'), ('ByteWrangler'), ('LogicLord'),
  ('SyntaxSorcerer'), ('FrameworkPhilosopher'), ('LibraryLiaison'), ('APIArchitect'), ('DatabaseDreamer'),
  ('AlgorithmArtist'), ('DataStructureDancer'), ('RecursionRider'), ('IterationImpresario'), ('ConditionConductor'),
  ('LoopLiberator'), ('VariableVirtuoso'), ('FunctionPhenom'), ('ClassComposer'), ('ObjectOrchestrator'),
  ('InterfaceInnovator'), ('AbstractArtisan'), ('PolymorphismPioneer'), ('InheritanceIdol'), ('EncapsulationExpert')
ON CONFLICT (nick) DO NOTHING;
