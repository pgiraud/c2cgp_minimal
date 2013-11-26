# -*- coding: utf-8 -*-
import logging
import os

from pyramid.i18n import TranslationStringFactory
from formalchemy import fields
from formalchemy import FieldSet, Grid

from c2cgp_minimal import models
from c2cgeoportal.forms import *

_ = TranslationStringFactory('c2cgp_minimal')
log = logging.getLogger(__name__)
