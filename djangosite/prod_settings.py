from .settings import *
from .local_prod_settings import *

DEBUG = False

CSRF_COOKIE_SECURE = True

SESSION_COOKIE_SECURE = True

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "assets"),
]

WEBPACK_LOADER = {
    'WISHLIST': {
        'BUNDLE_DIR_NAME': 'wishlist_bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats-wishlist.prod.json'),
    }
}