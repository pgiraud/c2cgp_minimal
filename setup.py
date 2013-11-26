# -*- coding: utf-8 -*-

try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup, find_packages

setup(
    name='c2cgp_minimal',
    version='1.0',
    description='c2cgp_minimal, a c2cgeoportal project',
    author='camptocamp',
    author_email='info@camptocamp.com',
    url='http://www.camptocamp.com/geospatial-solutions',
    install_requires=[
        'c2cgeoportal',
    ],
    packages=find_packages(exclude=['ez_setup']),
    include_package_data=True,
    message_extractors={'c2cgp_minimal': [
        ('static/**', 'ignore', None),
        ('**.py', 'python', None),
        ('templates/**', 'mako', {'input_encoding': 'utf-8'})]},
    zip_safe=False,
    entry_points={
        'paste.app_factory': [
            'main = c2cgp_minimal:main',
        ],
        'console_scripts': [
            'create_db = c2cgp_minimal.scripts.create_db:main',
        ],
    },
)
