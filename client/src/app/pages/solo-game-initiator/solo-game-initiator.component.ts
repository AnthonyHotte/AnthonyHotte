import { Component, OnInit } from '@angular/core';
import { SoloModeInformationsService } from '@app/services/solo-mode-informations.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-solo-game-initiator',
    templateUrl: './solo-game-initiator.component.html',
    styleUrls: ['./solo-game-initiator.component.scss'],
})
export class SoloGameInitiatorComponent implements OnInit {

    private inscription: Subscription;
    private VALEUR_TEMPS_DEFAULT = 60;
    message: string[];
    nomTemporaire: string = 'Joueur';
    nom: string = 'Joueur';
    nomAdversaire: string;
    idNomAdversaire: number;
    nomEstValide: boolean = true;
    difficulteFacile: boolean = true;
    tempsDeJeu: number = this.VALEUR_TEMPS_DEFAULT;
    private listeDesInsultes: string =
        '2 girls 1 cup 2g1c 4r5e5h1t5hita$$a$$holea_s_sa2ma54a55a55holeaeolusaholealabama hot pocketalaskan pipelineanalanal impaleranal leakageanalannieanalprobeanalsexanilingusanusapeshitar5eareolaareolearianarrsearsearseholearyanassass fuckass holeassaultassbagassbaggerassbanditassbangassbangedassbangerassbangsassbiteassblasterassclownasscockasscrackerassesassfaceassfacesassfuckassfuckerass-fuckerassfukkaassgoblinassh0leasshatass-hatassheadassho1eassholeassholesasshopperasshoreass-jabberassjackerassjockeyasskissasskisserassklownasslickasslickerassloverassmanassmasterassmonkeyassmucusassmunchassmuncherassniggerasspackerasspirateass-pirateasspuppiesassrangerassshitasssholeasssuckerasswadasswholeasswhoreasswipeasswipesauto eroticautoeroticaxwoundazazelazzb!tchb00bsb17chb1tchbabebabelandbabesbaby batterbaby juicebadfuckball gagball gravyball kickingball lickingball sackball suckingballbagballlickerballsballsackbampotbangbang boxbangbrosbangerbangingbarebackbarely legalbarenakedbarfbarfacebarffacebastardbastardobastardsbastinadobatty boybawdybazongasbazoomsbbwbdsmbeanerbeanersbeardedclambeastialbeastialitybeatchbeaterbeatyourmeatbeaverbeaver cleaverbeaver lipsbeef curtainbeef curtainsbeerbeeyotchbellendbenderbeotchbestialbestialitybi+chbiatchbicuriousbig blackbig breastsbig knockersbig titsbigbastardbigbuttbiggerbigtitsbimbobimbosbintbirdlockbisexualbi-sexualbitchbitch titbitchassbitchedbitcherbitchersbitchesbitchezbitchinbitchingbitchtitsbitchyblack cockblonde actionblonde on blonde actionbloodclaatbloodybloody hellblowblow jobblow meblow mudblow your loadblowjobblowjobsblue waffleblumpkinboangbodbodilyboganbohunkboinkboiolasbollickbollockbollocksbollokbolloxbomdbondagebonebonedbonerbonersbongboobboobiesboobsboobyboogerbookieboongboongabooobsboooobsbooooobsbooooooobsbooteebootiebootybooty callboozeboozerboozybosombosomybowelbowelsbrabrassierebreastbreastjobbreastloverbreastmanbreastsbreederbrotherfuckerbrown showersbrunette actionbucetabuggerbuggeredbuggerybukkakebull shitbullcrapbulldikebulldykebullet vibebullshitbullshitsbullshittedbullturdsbumbum boybumblefuckbumclatbumfuckbummerbungbung holebungabungholebunny fuckerbust a loadbustybutchdikebutchdykebuttbutt fuckbutt plugbuttbangbutt-bangbuttcheeksbuttfacebuttfuckbutt-fuckbuttfuckabuttfuckerbutt-fuckerbuttheadbuttholebuttmanbuttmuchbuttmunchbuttmuncherbutt-piratebuttplugc.0.c.kc.o.c.k.c.u.n.tc0ckc-0-c-kc0cksuckercacacahonecamel toecameltoecamgirlcamslutcamwhorecarpet munchercarpetmunchercawkcervixchesticlechi-chi manchick with a dickchild-fuckerchinchincchincschinkchinkychoadchoadechoc icechocolate rosebudschodechodeschota bagscipacirclejerkcl1tcleveland steamerclimaxclitclit lickerclitfaceclitfuckclitorisclitorusclitsclittyclitty litterclogwogclover clampsclungeclusterfuckcnutcocaincocainecockc-o-c-kcock pocketcock snotcock suckercockasscockbitecockblockcockburgercockeyecockfacecockfuckercockheadcockholstercockjockeycockknockercockknokercocklickercocklovercocklumpcockmastercockmonglercockmongruelcockmonkeycockmunchcockmunchercocknosecocknuggetcockscockshitcocksmithcocksmokecocksmokercocksniffercocksucercocksuckcocksuck cocksuckedcocksuckercock-suckercocksuckerscocksuckingcocksuckscocksukacocksukkacockwafflecoffin dodgercoitalcokcokmunchercoksuckacommiecondomcoochiecoochycooncoonnasscoonscootercop some woodcoprolagniacoprophiliacorksuckercornholecorp whorecoxcrabscrackcrackercrackwhorecrack-whorecrapcrappycreampiecretincrikeycripplecrottecumcum chuggercum dumpstercum freakcum guzzlercumbubblecumdumpcumdumpstercumguzzlercumjockeycummercummincummingcumscumshotcumshotscumslutcumstaincumtartcunilinguscunillinguscunncunniecunnilinguscunnttcunnycuntc-u-n-tcunt haircuntasscuntbagcuntfacecuntfuckcuntfuckercuntholecunthuntercuntlickcuntlick cuntlickercuntlicker cuntlickingcuntragcuntscuntsiclecuntslutcunt-struckcuntsuckercut ropecyaliscyberfuccyberfuckcyberfuckedcyberfuckercyberfuckerscyberfuckingcybersexd0ngd0uch3d0uched1ckd1ld0d1ldodagodagosdammitdamndamneddamnitdarkiedarndate rapedaterapedawgie-styledeep throatdeepthroatdeggodendrophiliadickdick headdick holedick shydickbagdickbeatersdickbraindickdipperdickfacedickflipperdickfuckdickfuckerdickheaddickheadsdickholedickishdick-ishdickjuicedickmilkdickmongerdickripperdicksdicksipperdickslapdick-sneezedicksuckerdicksuckingdickticklerdickwaddickweaseldickweeddickwhipperdickwoddickzipperdiddledikedildodildosdiligafdillweeddimwitdingledingleberriesdingleberrydinkdinksdipshipdipshitdirsadirtydirty pillowsdirty sanchezdlckdog styledog-fuckerdoggie styledoggiestyledoggie-styledoggindoggingdoggy styledoggystyledoggy-styledolcettdominationdominatrixdommesdongdonkey punchdonkeypunchdonkeyribberdoochbagdoofusdookiedooshdopeydouble dongdouble penetrationdoubleliftdouch3douchedouchebagdouchebagsdouche-fagdouchewaffledoucheydp actiondrunkdry humpduchedumassdumb assdumbassdumbassesdumbcuntdumbfuckdumbshitdummydumshitdvdadykedykeseat a dickeat hair pieeat my asseatpussyecchiejaculateejaculatedejaculatesejaculatingejaculatingsejaculationejakulateenlargementerecterectioneroticerotismescortessohbeeeunuchextacyextasyf u c kf u c k e rf.u.c.kf_u_c_kf4nnyfacefuckerfacialfackfagfagbagfagfuckerfaggfaggedfaggingfaggitfaggittfaggotfaggotcockfaggotsfaggsfagotfagotsfagsfagtardfaigfaigtfannyfannybanditfannyflapsfannyfuckerfanyyfartfartknockerfastfuckfatfatassfatfuckfatfuckerfcukfcukerfcukingfecalfeckfeckerfelchfelcherfelchingfellatefellatiofeltchfeltcherfemale squirtingfemdomfenianfiggingfingerbangfingerfuckfingerfuck fingerfuckedfingerfuckerfingerfucker fingerfuckersfingerfuckingfingerfucksfingeringfist fuckfistedfistfuckfistfuckedfistfuckerfistfucker fistfuckersfistfuckingfistfuckingsfistfucksfistingfistyflamerflangeflapsfleshfluteflog the logfloozyfoadfoahfondlefoobarfookfookerfoot fetishfootfuckfootfuckerfootjobfootlickerforeskinfreakfuckfreakyfuckerfreefuckfreexfriggfriggafrottingfubarfucfuckf-u-c-kfuck buttonsfuck holefuck offfuck puppetfuck trophyfuck yo mamafuck youfuckafuckassfuck-assfuckbagfuck-bitchfuckboyfuckbrainfuckbuttfuckbutterfuckedfuckedupfuckerfuckersfuckersuckerfuckfacefuckfreakfuckheadfuckheadsfuckherfuckholefuckinfuckingfuckingbitchfuckingsfuckingshitmotherfuckerfuckmefuckme fuckmeatfuckmehardfuckmonkeyfucknuggetfucknutfucknuttfuckofffucksfuckstickfucktardfuck-tardfucktardsfucktartfucktoyfucktwatfuckupfuckwadfuckwhitfuckwhorefuckwitfuckwittfuckyoufudge packerfudgepackerfudge-packerfukfukerfukkerfukkersfukkinfuksfukwhitfukwitfuqfutanarifuxfux0rfvckfxckgaegaigang banggangbanggang-banggangbangedgangbangsganjagashgassy assgay sexgayassgaybobgaydogayfuckgayfuckistgaylordgaysgaysexgaytardgaywadgender bendergenitalsgeygfyghaygheygiant cockgigologingergippogirl ongirl on topgirls gone wildgitglansgoatcxgoatsegod damngodamngodamnitgoddamgod-damgoddammitgoddamngoddamnedgod-damnedgoddamnitgoddamnmuthafuckergodsdamngokkungolden showergoldenshowergolliwoggonadgonadsgonorreheagoo girlgoochgoodpoopgookgooksgoregasmgotohellgringogropegroup sexgspotg-spotgtfoguidoguroh0m0h0moham flaphand jobhandjobhard corehard onhardcorehardcoresexhe11headfuckhebeheebhellhemphentaiheroinherpherpesherpyheshehe-shehitlerhivhohoarhoarehobaghoehoerholy shithom0homeyhomohomodumbshithomoerotichomoeyhonkeyhonkyhoochhookahhookerhoorhootchhooterhootershorehorniesthornyhot carlhot chickhotpussyhotsexhow to killhow to murdephow to murderhuge fathumphumpedhumpinghunhussyhymeniapiberian slapinbredincestinjunintercoursej3rk0ffjack offjackassjackassesjackholejackoffjack-offjaggijagoffjail baitjailbaitjapjapsjelly donutjerkjerk offjerk0ffjerkassjerkedjerkoffjerk-offjigaboojiggaboojiggerboojismjizjizmjizzjizzedjockjuggsjungle bunnyjunglebunnyjunkiejunkykafirkawkkikekikeskillkinbakukinksterkinkykkkklanknobknob endknobbingknobeadknobedknobendknobheadknobjockyknobjokeykockkondumkondumskoochkoocheskootchkrautkumkummerkummingkumskunilinguskunjakuntkwifkykel3i+chl3itchlabialameasslardassleather restraintleather straight jacketlechlemon partyleperlesbianlesbianslesbolesboslezlezbianlezbianslezbolezboslezzalezzielezzieslezzylmaolmfaoloinloinslolitalooneylovemakinglubelustlustinglustym0f0m0fom45terbatema5terb8ma5terbatemafuglymake me comemale squirtingmamsmasochistmassamasterb8masterbatmasterbat3masterbatemaster-batemasterbatingmasterbationmasterbationsmasturbatemasturbatingmasturbationmaximcfaggetmenage a troismensesmenstruatemenstruationmethm-fuckingmickmiddle fingermidgetmilfmingemingermissionary positionmof0mofomo-fomolestmongmoo moo foo foomooliemoronmothafuckmothafuckamothafuckasmothafuckazmothafuckedmothafuckermothafuckersmothafuckinmothafuckingmothafuckingsmothafucksmother fuckermotherfuckmotherfuckamotherfuckedmotherfuckermotherfuckersmotherfuckinmotherfuckingmotherfuckingsmotherfuckkamotherfucksmound of venusmr handsmtherfuckermthrfuckermthrfuckingmuffmuff divermuff puffmuffdivermuffdivingmungingmuntermurdermuthamuthafeckermuthafuckazmuthafuckkermuthermutherfuckermutherfuckingmuthrfuckingn1ggan1ggernadnadsnakednamblanapalmnappynawashinazinazismneed the dicknegroneonazinig nognigaboonigg3rnigg4hnigganiggahniggasniggazniggerniggersnigglenigletnig-nognimphomanianimrodninnynipplenipplesnobnob jokeynobheadnobjockynobjokeynoncenookynsfw imagesnudenuditynumbnutsnut butternut sacknutsacknutternymphonymphomaniaoctopussyold bagomgomorashione cup two girlsone guy one jaropiateopiumoralorallyorganorgasimorgasimsorgasmorgasmicorgasmsorgiesorgyovaryovumovumsp.u.s.s.y.p0rnpaddypaedophilepakipanoochpansypantiepantiespantypastiepastypawnpcppeckerpeckerheadpedopedobearpedophilepedophiliapedophiliacpeepeepeepeggingpenetratepenetrationpenialpenilepenispenisbangerpenisfuckerpenispufferperversionpeyotephalliphallicphone sexphonesexphuckphukphukedphukingphukkedphukkingphuksphuqpiece of shitpigfuckerpikeypillowbiterpimppimpispinkopisspiss offpiss pigpissedpissed offpisserpisserspissespissflapspissinpissingpissoffpiss-offpisspigplayboypleasure chestpmspolackpole smokerpolesmokerpollockponyplaypoofpoonpoonanipoonanypoontangpooppoop chutepoopchutepoopuncherporch monkeyporchmonkeypornpornopornographypornospotpottyprickpricksprickteaserprigprince albert piercingprodpronprostituteprudepsychopthcpubepubespubicpubispunanipunannypunanypunkasspunkypuntapusspussepussipussiespussypussy fartpussy palacepussylickingpussypounderpussyspustputoqueafqueefqueerqueerbaitqueerholequeeroqueersquickyquimracyragheadraging bonerraperapedraperrapeyrapingrapistraunchrectalrectumrectusreeferreetardreichrenobretardretardedreverse cowgirlrevuerimjawrimjobrimmingritardrosy palmrosy palm and her 5 sistersrtardr-tardrubbishrumrumprumprammerruskirusty trombones hits&ms.h.i.t.s.o.b.s_h_i_ts0bsadismsadistsambosand niggersandbarsandlersandniggersangersantorumsausage queenscagscantilyscatschizoschlongscissoringscrewscrewedscrewingscroatscrogscrotscrotescrotumscrudscumseamanseamenseducesekssemensexsexosexualsexysh!+sh!tsh1ts-h-1-tshagshaggershagginshaggingshamedameshaved beavershaved pussyshemaleshi+shibarishirt liftershits-h-i-tshit assshit fuckershitassshitbagshitbaggershitblimpshitbrainsshitbreathshitcannedshitcuntshitdickshiteshiteatershitedshiteyshitfaceshitfacedshitfuckshitfullshitheadshitheadsshitholeshithouseshitingshitingsshitsshitspittershitstainshittshittedshittershittersshittiershittiestshittingshittingsshittyshizshiznitshotashrimpingsissyskagskankskeetskullfuckslagslanteyeslavesleazesleazyslopeslutslut bucketslutbagslutdumperslutkissslutssmartasssmartassessmegsmegmasmutsmuttysnatchsnipersnowballingsnuffs-o-bsod offsodomsodomizesodomyson of a bitchson of a motherless goatson of a whoreson-of-a-bitchsousesousedspacspadespermspicspickspikspikssploogesplooge moosespoogespookspread legsspunksteamystfustiffystonedstrap onstraponstrappadostripstrip clubstrokestupidstyle doggysucksuckasssuckedsuckingsuckssuicide girlssultry womensumofabiatchswastikaswingert1tt1tt1e5t1ttiestafftaigtainted lovetaking the pisstampontardtarttaste mytawdrytea baggingteabaggingteatteetsteezterdtestetesteetestestesticaltesticletestisthreesomethroatingthrustthugthundercunttied uptight whitetinkletittit wanktitfucktitititiestitstitttittie5tittiefuckertittiestittytittyfucktittyfuckertittywanktitwanktoketongue in atootstoplesstossertowelheadtramptrannytranssexualtrashytribadismtrumpedtub girltubgirlturdtushtushytw4ttwattwatheadtwatlipstwatstwattytwatwaffletwinktwinkietwo fingerstwo fingers with tonguetwo girls one cuptwunttwunteruglyunclefuckerundiesundressingunwedupskirturethra playurinalurineurophiliauterusuziv14grav1gravagvaginavajayjayva-j-jvaliumvenus moundveqtableviagravibratorviolet wandvirginvixenvjayjayvodkavomitvorarephiliavoyeurvulgarvulvaw00sewadwangwankwankerwankjobwankywazoowedgieweedweenieweeweeweinerweirdowenchwet dreamwetbackwh0rewh0refacewhite powerwhiteywhizwhoarwhoraliciouswhorewhorealiciouswhorebagwhoredwhorefacewhorehopperwhorehousewhoreswhoringwiggerwillieswillywindow lickerwiseasswiseasseswogwombwoodywopwrapping menwrinkled starfishwtfxratedx-ratedxxxxxyaoiyeastyyellow showersyidyiffyyobbozoophilezoophiliazubbputainputefils de putefille de putefilles de putebordelpétassecatinmorueconconneconnardconnasseEnculéenculéeenculeenculeepédéPDpédaletapettetantouzefiottetafioletarlouzesac à foutrepetite bitecouille mollesalopesalopardsaloperiechiennebitchbiatchcagoleshemaletravelogouinenègrenégroniggernigganegrechintoquebouffeur bouffeuseboufeurboufeuses bougnoulmongolmongoliendébiledebileabrutiabrut1imbécileimbecile1mbecileidiotautistetrisomiquetrisoattardéattardetarétarecrétincretinbenêtnigaudfoufollefolpochtronpochtronnedroguédrogueivrognepisseusemorveuxmorveusemerdeuxmerdeusebouffonboufonbordillebusechauffardchauffardecrevureenfoiréenfoireenflureetronétronflaque de parvo fripouillefumiermangemerdemange-merdemange merdemerdenazepourriturepouriturepunaiseracluresagouinsalaudsalopesaloppesaletésaletetâchetächetachetas de purinvaurienpignouftrouesticalissecâlissecoliscôlistabarnactabarnaktabarnacksacrementsacrémentsiboireciboirecaveortofifincelf1fpu$$y1ncelv1rgin';
    
    constructor(private informations: SoloModeInformationsService){}

    ngOnInit(): void {
        this.assignerNomAdversaire();
        this.inscription = this.informations.messageCourant.subscribe(message => this.message = message);
    }

    assignerNomAdversaire() {
        const NOMBRE_DE_NOMS = 3;
        switch ((this.idNomAdversaire = Math.floor(Math.random() * NOMBRE_DE_NOMS) + 1)) {
            case 1:
                this.nomAdversaire = 'Haruki Murakami';
                break;
            case 2:
                this.nomAdversaire = 'Daphne du Maurier';
                break;
            default:
                this.nomAdversaire = 'Jane Austen';
        }
    }

    verifierNoms() {
        const VERIFICATION_PRESENCE = -1;
        const temp: string = this.nomTemporaire.split(' ').join('').toLocaleLowerCase();
        this.assignerNomAdversaire();
        if (this.nomTemporaire.split(' ').join('').toLocaleLowerCase() === this.nomAdversaire.split(' ').join('').toLocaleLowerCase()) {
            switch (this.idNomAdversaire) {
                case 1:
                    this.nomAdversaire = 'Daphne du Maurier';
                    break;
                case 2:
                    this.nomAdversaire = 'Jane Austen';
                    break;
                default:
                    this.nomAdversaire = 'Haruki Murakami';
            }
        } else if (this.nomTemporaire.split(' ').join('') === '') {
            this.nomEstValide = false;
        } else if (this.nomTemporaire.length > 17) {
            this.nomEstValide = false;
        } else if (
            this.listeDesInsultes.search(temp.substring(0, 3)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(4, 7)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(8, 10)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(11, 13)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(14, 16)) !== VERIFICATION_PRESENCE
        ) {
            this.nomEstValide = false;
        } else {
            this.nomEstValide = true;
        }
    }
    setNom() {
        this.verifierNoms();
        if (this.nomEstValide) {
            this.nom = this.nomTemporaire;
            this.informations.changerMessage([this.nom, this.nomAdversaire, this.difficulteFacile.toString(), this.tempsDeJeu.toString()]);
            return this.nom;
        } else {
            return 'Ce nom est invalide! Recommencez...';
        }
    }
    afficherValiditeEnCaracteres() {
        if (this.nomEstValide) {
            return 'valide';
        } else return 'invalide';
    }
    setDifficulte(facile: boolean) {
        this.difficulteFacile = facile;
    }
    getDifficulte() {
        if (this.difficulteFacile === true) {
            return 'Débutant';
        } else {
            return 'Expert';
        }
    }
    getTempsDeJeu() {
        return this.tempsDeJeu;
    }

    ngOnDestroy(){
        this.inscription.unsubscribe();
    }
}
