import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publicOrigin,allowedOrigin,proxyHops,clientAddress} from './network.js';

test('public origin accepts HTTPS proxy host rewriting without trusting arbitrary origins',()=>{
 const configured=publicOrigin('https://council.example/');
 assert.equal(configured,'https://council.example');
 assert.ok(allowedOrigin({origin:configured,host:'internal:10000'},configured));
 assert.ok(!allowedOrigin({origin:'https://attacker.example',host:'internal:10000'},configured));
 assert.ok(!allowedOrigin({origin:'https://council.example.attacker.example',host:'internal:10000'},configured));
 assert.ok(!allowedOrigin({origin:'null',host:'internal:10000'},configured));
 assert.ok(!allowedOrigin({origin:'https://council.example/path',host:'internal:10000'},configured));
});
test('local network origins work without trusting forwarded hosts',()=>{
 assert.ok(allowedOrigin({origin:'http://192.168.1.2:3017',host:'192.168.1.2:3017'},null));
 assert.ok(!allowedOrigin({origin:'https://other.example',host:'localhost:3017','x-forwarded-host':'other.example'},null));
 assert.ok(allowedOrigin({host:'localhost:3017'},null));
 for(const value of ['file:///tmp','https://user:pass@example.com','https://example.com/path','https://example.com?token=a'])assert.throws(()=>publicOrigin(value));
});
test('forwarded client addresses require explicit trusted proxy hops',()=>{
 const request={socket:{remoteAddress:'10.0.0.1'},headers:{'x-forwarded-for':'spoofed, 203.0.113.8'}};
 assert.equal(clientAddress(request), '10.0.0.1');
 assert.equal(clientAddress(request,1),'203.0.113.8');
 assert.equal(proxyHops(),0);assert.equal(proxyHops('1'),1);
 for(const value of ['true','-1','1.5','6'])assert.throws(()=>proxyHops(value));
});
