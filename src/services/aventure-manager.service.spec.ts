import { TestBed } from '@angular/core/testing';

import { AventureManagerService } from './aventure-manager.service';

describe('AventureManagerService', () => {
  let service: AventureManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AventureManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the correct result', () => {
    const endingState = service.getAdventureResult(`C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 0 - 3 - 2
T - 1 - 3 - 3
# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axevertical} - {Orientation} - {Séquence de mouvement
A - Lara - 1 - 1 - S - AADADAGGA`)
    expect(endingState).toBe(`C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 1 - 3 - 2
A - Lara - 0 - 3 - S - 3`);
  });

  it('should be blocked by mountain', () => {
    const endingState = service.getAdventureResult(`C - 3 - 4
M - 2 - 2
A - Allan - 2 - 1 - S - AAAAA`);
expect(endingState).toBe(`C - 3 - 4
M - 2 - 2
A - Allan - 2 - 1 - S - 0`);
  });

  it('should be blocked by boundary', () => {
    const endingState = service.getAdventureResult(`C - 3 - 4
A - Allan - 0 - 0 - N - AAAAA`);
expect(endingState).toBe(`C - 3 - 4
A - Allan - 0 - 0 - N - 0`);
  });

  it('should be blocked by boundary', () => {
    const endingState = service.getAdventureResult(`C - 3 - 4
A - Allan - 0 - 0 - N - AAAAA`);
expect(endingState).toBe(`C - 3 - 4
A - Allan - 0 - 0 - N - 0`);
  });

  it('should be blocked by other player', () => {
    const endingState = service.getAdventureResult(`C - 3 - 4
A - Weixin - 1 - 1 - S - AAA
A - Allan - 1 - 2 - N - AAA`);
expect(endingState).toBe(`C - 3 - 4
A - Weixin - 1 - 1 - S - 0
A - Allan - 1 - 2 - N - 0`);
  });

  it('should take one treasure', () => {
    const endingState = service.getAdventureResult(`C - 3 - 4
T - 1 - 2 - 3
A - Allan - 1 - 1 - S - AAA`);
expect(endingState).toBe(`C - 3 - 4
T - 1 - 2 - 2
A - Allan - 1 - 3 - S - 1`);
  });
});
