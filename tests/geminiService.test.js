import test from 'node:test';
import assert from 'node:assert/strict';
import gerarDescricaoComGemini from '../src/services/geminiService.js';

test('gera descrição e alt mesmo sem API key', async () => {
  const buffer = Buffer.from('fake-image');
  const resultado = await gerarDescricaoComGemini(buffer);

  assert.ok(resultado);
  assert.equal(typeof resultado.descricao, 'string');
  assert.equal(typeof resultado.alt, 'string');
  assert.ok(resultado.descricao.length > 0);
  assert.ok(resultado.alt.length > 0);
});
