-- Strengthen Texas story discovery with primary-source-targeted and regional feeds.
-- These feeds only add discovery inputs. Existing relevance, source-quality,
-- clustering, fact-verification, publication-readiness, and publication-safety
-- controls remain unchanged.

WITH sources(platform, source_name, source_url, rss_url, category, notes, enabled) AS (
  VALUES
    ('rss', 'Texas Governor Primary Source — Google News', 'https://gov.texas.gov/news', 'https://news.google.com/rss/search?q=site%3Agov.texas.gov%2Fnews+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'Primary-source-targeted discovery for governor appointments, directives, grants, disaster actions, economic-development announcements, and proclamations.', true),
    ('rss', 'Texas Attorney General Primary Source — Google News', 'https://www.texasattorneygeneral.gov/news', 'https://news.google.com/rss/search?q=site%3Atexasattorneygeneral.gov%2Fnews+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'Primary-source-targeted discovery for AG settlements, lawsuits, investigations, consumer actions, and enforcement announcements.', true),
    ('rss', 'Texas DPS Primary Source — Google News', 'https://www.dps.texas.gov/news', 'https://news.google.com/rss/search?q=site%3Adps.texas.gov%2Fnews+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Primary-source-targeted discovery for wanted notices, fugitive captures, rewards, alerts, enforcement actions, and public-safety releases.', true),
    ('rss', 'Texas Parks Wildlife Primary Source — Google News', 'https://tpwd.texas.gov/newsmedia/releases/', 'https://news.google.com/rss/search?q=site%3Atpwd.texas.gov+%28release+OR+news%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Non-Political', 'Primary-source-targeted discovery for parks, wildlife, fisheries, conservation, outdoor recreation, unusual animal stories, and agency notices.', true),
    ('rss', 'Texas Workforce Primary Source — Google News', 'https://www.twc.texas.gov/news', 'https://news.google.com/rss/search?q=site%3Atwc.texas.gov+%28grant+OR+jobs+OR+workforce+OR+training%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Business', 'Primary-source-targeted discovery for training grants, workforce programs, employer initiatives, labor-market releases, and regional investments.', true),
    ('rss', 'Texas Emergency and Forest Service Primary Sources — Google News', 'https://tdem.texas.gov/', 'https://news.google.com/rss/search?q=%28site%3Atdem.texas.gov+OR+site%3Atfsweb.tamu.edu%29+%28fire+OR+wildfire+OR+disaster+OR+evacuation+OR+emergency%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen', 'Weather', 'Primary-source-targeted discovery for wildfire, disaster, evacuation, emergency-response, and incident-status updates.', true),
    ('rss', 'Texas Transportation Primary Source — Google News', 'https://www.txdot.gov/about/newsroom.html', 'https://news.google.com/rss/search?q=site%3Atxdot.gov+%28project+OR+grant+OR+road+OR+bridge+OR+transportation+OR+investment%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Business', 'Primary-source-targeted discovery for major transportation projects, funding, closures, infrastructure awards, and statewide mobility announcements.', true),
    ('rss', 'Texas Courts Primary Source — Google News', 'https://www.txcourts.gov/', 'https://news.google.com/rss/search?q=site%3Atxcourts.gov+%28opinion+OR+order+OR+court+OR+judicial%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Politics', 'Primary-source-targeted discovery for Texas appellate-court orders, opinions, judicial administration, and court-system announcements.', true),
    ('rss', 'Texas Education Primary Sources — Google News', 'https://tea.texas.gov/', 'https://news.google.com/rss/search?q=%28site%3Atea.texas.gov+OR+site%3Ahighered.texas.gov%29+%28grant+OR+program+OR+degree+OR+school+OR+college+OR+university%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Education', 'Primary-source-targeted discovery for TEA and THECB policy, grants, degree programs, accountability, and statewide education initiatives.', true),
    ('rss', 'Texas Comptroller Primary Source — Google News', 'https://comptroller.texas.gov/about/media-center/', 'https://news.google.com/rss/search?q=site%3Acomptroller.texas.gov+%28revenue+OR+economy+OR+sales+tax+OR+report+OR+grant%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen', 'Business', 'Primary-source-targeted discovery for state revenue, economic indicators, local sales-tax allocations, reports, and fiscal announcements.', true),

    ('rss', 'Texas Panhandle and South Plains — Regional Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Amarillo+OR+Lubbock+OR+Plainview+OR+Pampa+OR+Canyon+OR+Levelland+OR+Brownfield%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Regional sweep for Panhandle and South Plains government, business, schools, public safety, sports, and human-interest stories.', true),
    ('rss', 'West Texas and Permian Basin — Regional Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Midland+OR+Odessa+OR+Abilene+OR+San+Angelo+OR+Big+Spring+OR+Pecos+OR+Fort+Stockton%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Regional sweep for Permian Basin and West Texas government, energy, business, public safety, sports, and community stories.', true),
    ('rss', 'North Texas and Cross Timbers — Regional Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Fort+Worth+OR+Arlington+OR+Denton+OR+Weatherford+OR+Mineral+Wells+OR+Graham+OR+Jacksboro+OR+Wichita+Falls%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Regional sweep for North Texas and Cross Timbers municipal, wildfire, business, public-safety, sports, and unusual local stories.', true),
    ('rss', 'East Texas and Piney Woods — Regional Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Tyler+OR+Longview+OR+Lufkin+OR+Nacogdoches+OR+Marshall+OR+Palestine+OR+Jasper+OR+Huntsville%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Regional sweep for East Texas government, courts, schools, public safety, business, outdoors, and community stories.', true),
    ('rss', 'Central Texas and Brazos Valley — Regional Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Waco+OR+Temple+OR+Killeen+OR+Belton+OR+Bryan+OR+College+Station+OR+Brenham+OR+Georgetown%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Regional sweep for Central Texas and Brazos Valley government, universities, business, sports, public safety, and community stories.', true),
    ('rss', 'Gulf Coast and Coastal Bend — Regional Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Corpus+Christi+OR+Victoria+OR+Port+Lavaca+OR+Rockport+OR+Galveston+OR+Freeport+OR+Baytown+OR+Beaumont+OR+Port+Arthur%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Regional sweep for Gulf Coast and Coastal Bend industry, ports, weather, government, public safety, tourism, wildlife, and community stories.', true),
    ('rss', 'South Texas and Rio Grande Valley — Regional Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28Laredo+OR+McAllen+OR+Brownsville+OR+Harlingen+OR+Edinburg+OR+Mission+OR+Kingsville+OR+Alice+OR+Eagle+Pass+OR+Del+Rio%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Regional sweep for South Texas and Rio Grande Valley border, business, government, schools, public safety, and human-interest stories.', true),
    ('rss', 'Hill Country and San Antonio Region — Regional Discovery', 'https://news.google.com/', 'https://news.google.com/rss/search?q=%28San+Antonio+OR+New+Braunfels+OR+Boerne+OR+Kerrville+OR+Fredericksburg+OR+Seguin+OR+Universal+City+OR+Schertz%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', 'Local', 'Regional sweep for San Antonio and Hill Country municipal, military, business, tourism, public-safety, education, and unusual local stories.', true)
)
INSERT INTO public.content_sources (platform, source_name, source_url, rss_url, category, notes, enabled)
SELECT s.*
FROM sources s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.content_sources existing
  WHERE lower(existing.rss_url) = lower(s.rss_url)
);

UPDATE public.content_sources
SET enabled = true
WHERE source_name IN (
  'Texas Governor Primary Source — Google News',
  'Texas Attorney General Primary Source — Google News',
  'Texas DPS Primary Source — Google News',
  'Texas Parks Wildlife Primary Source — Google News',
  'Texas Workforce Primary Source — Google News',
  'Texas Emergency and Forest Service Primary Sources — Google News',
  'Texas Transportation Primary Source — Google News',
  'Texas Courts Primary Source — Google News',
  'Texas Education Primary Sources — Google News',
  'Texas Comptroller Primary Source — Google News',
  'Texas Panhandle and South Plains — Regional Discovery',
  'West Texas and Permian Basin — Regional Discovery',
  'North Texas and Cross Timbers — Regional Discovery',
  'East Texas and Piney Woods — Regional Discovery',
  'Central Texas and Brazos Valley — Regional Discovery',
  'Gulf Coast and Coastal Bend — Regional Discovery',
  'South Texas and Rio Grande Valley — Regional Discovery',
  'Hill Country and San Antonio Region — Regional Discovery'
);
