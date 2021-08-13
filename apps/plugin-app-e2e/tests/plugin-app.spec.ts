import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('plugin-app e2e', () => {
  it('should create plugin-app', async () => {
    const plugin = uniq('plugin-app');
    ensureNxProject(
      '@share-generators-over-plugins/plugin-app',
      'dist/libs/plugin-app'
    );
    await runNxCommandAsync(
      `generate @share-generators-over-plugins/plugin-app:plugin-app ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('plugin-app');
      ensureNxProject(
        '@share-generators-over-plugins/plugin-app',
        'dist/libs/plugin-app'
      );
      await runNxCommandAsync(
        `generate @share-generators-over-plugins/plugin-app:plugin-app ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('plugin-app');
      ensureNxProject(
        '@share-generators-over-plugins/plugin-app',
        'dist/libs/plugin-app'
      );
      await runNxCommandAsync(
        `generate @share-generators-over-plugins/plugin-app:plugin-app ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
