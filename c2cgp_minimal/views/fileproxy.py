from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPForbidden, HTTPNotFound
from proxy import Proxy
from c2cgeoportal.lib.filter_capabilities import (
    _get_protected_layers as get_protected_layers,
    _get_private_layers as get_private_layers,
)
import logging

log = logging.getLogger(__name__)

"""
The file_proxy view config can be used to give access to files to user
depending on their permissions. The layer permission system is used here to
allow or forbid users to access to the file.
Files can be put on any server as soon as the current application can have
access to them. The server on which the files are doesn't need to be internet
accessible.

A new route needs to be added to `__init__.py` as follows:
    config.add_route('file_proxy', '/file_proxy/{layer}/{file}')

A new configuration parameter needs to be added to `config.yaml.in` in a new
file_proxy section:
    url: http://name.of.server/path/to/files/

Then the files can be retrieved using a URL looking like the following:
    http://domain.com/instanceid/wsgi/file_proxy/layer_name/file.xxx
"""

class FileProxy(Proxy):

    def __init__(self, request):
        Proxy.__init__(self, request)

    @view_config(route_name='file_proxy')
    def file_proxy(self):
        layer = self.request.matchdict.get('layer')
        file = self.request.matchdict.get('file')

        role_id = None if self.request.user is None else \
            self.request.user.role.id

        if layer in get_private_layers() and \
                layer not in get_protected_layers(role_id):
            raise HTTPForbidden

        settings = self.request.registry.settings.get('file_proxy', {})
        url_prefix = settings['url']

        try:
            resp, content = self._proxy('%s/%s/%s' % (url_prefix, layer, file))
            headers = {}
            if 'content-type' in resp:
                headers['content-type'] = resp['content-type']
            if 'content-disposition' in resp:
                headers['content-disposition'] = resp['content-disposition']

            return Response(content, status=resp.status, headers=headers)
        except Exception as e:
            raise HTTPNotFound
